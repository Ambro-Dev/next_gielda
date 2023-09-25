import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prismadb";
import { Object } from "@prisma/client";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const {
    sendDate,
    sendTime,
    vehicle,
    category,
    school,
    receiveDate,
    receiveTime,
    description,
    objects,
    creator,
    directions,
    duration,
    distance,
    start_address,
    end_address,
    polyline,
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
      receiveTime,
      sendTime,
      sendDate,
      polyline,
      distance,
      duration,
      start_address,
      end_address,
      isAvailable: true,
      vehicleId: vehicle,
      categoryId: category,
      creatorId: creator,
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
      receiveTime,

      sendTime,
      isAvailable: true,
      vehicleId: vehicle,
      distance,
      duration,
      start_address,
      end_address,
      polyline,
      categoryId: category,
      creatorId: creator,
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
      sendDate: {
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
      sendTime: true,
      receiveTime: true,
      distance: true,
      duration: true,
      start_address: true,
      end_address: true,
      polyline: true,
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
