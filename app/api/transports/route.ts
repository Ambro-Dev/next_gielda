import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prismadb";
import { Object } from "@prisma/client";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const {
    sendDate,
    vehicle,
    category,
    type,
    school,
    receiveDate,
    availableDate,
    description,
    objects,
    creator,
    directions,
  } = body;

  const existingTransport = await prisma.transport.findFirst({
    where: {
      description,
      objects: {
        every: {
          name: {
            in: objects.map((object: Object) => object.name),
          },
        },
      },
      receiveDate,
      sendDate,
      availableDate,
      isAvailable: true,
      vehicleId: vehicle,
      categoryId: category,
      creatorId: creator,
      typeId: type,
      schoolId: school ? school : undefined,
      directions: {
        start: {
          lat: directions.start.lat,
          lng: directions.start.lng,
        },
        finish: {
          lat: directions.finish.lat,
          lng: directions.finish.lng,
        },
      },
    },
  });

  if (existingTransport) {
    return NextResponse.json({
      error: "Transport o podanych parametrach już istnieje",
      status: 409,
    });
  }

  const transport = await prisma.transport.create({
    data: {
      description,
      objects: {
        create: objects,
      },
      receiveDate,
      sendDate,
      availableDate,
      isAvailable: true,
      vehicleId: vehicle,
      categoryId: category,
      creatorId: creator,
      typeId: type,
      schoolId: school ? school : undefined,
      directions: {
        create: directions,
      },
    },
  });

  if (!transport) {
    throw new Error("Błąd dodawania transportu");
  }

  return NextResponse.json({
    message: "Transport został dodany",
    transportId: transport.id,
    status: 201,
  });
};

export const GET = async (req: NextRequest) => {
  await prisma.transport.updateMany({
    where: {
      availableDate: {
        lt: new Date(),
      },
    },
    data: {
      isAvailable: false,
    },
  });

  const transports = await prisma.transport.findMany({
    where: {
      isAvailable: true,
    },
    select: {
      id: true,
      sendDate: true,
      receiveDate: true,
      vehicle: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      type: {
        select: {
          id: true,
          name: true,
        },
      },
      directions: {
        select: {
          finish: {
            select: {
              lat: true,
              lng: true,
            },
          },
          start: {
            select: {
              lat: true,
              lng: true,
            },
          },
        },
      },
      creator: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  if (!transports) {
    return NextResponse.json({
      error: "Nie znaleziono transportów",
      status: 422,
    });
  }

  return NextResponse.json({ transports, status: 200 });
};
