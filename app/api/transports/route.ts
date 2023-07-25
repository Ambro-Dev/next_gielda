import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prismadb";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const {
    sendDate,
    vehicle,
    category,
    type,
    school,
    receiveDate,
    timeAvailable,
    description,
    objects,
    creator,
    directions,
  } = body;

  const transport = await prisma.transport.create({
    data: {
      description,
      objects: {
        create: objects,
      },
      receiveDate,
      sendDate,
      timeAvailable,
      isAvailable: true,
      vehicleId: vehicle,
      categoryId: category,
      creatorId: creator,
      typeId: type,
      schoolId: school,
      directions: {
        create: directions,
      },
    },
  });

  if (!transport) {
    throw new Error("Error creating transport");
  }

  return NextResponse.json(
    {
      message: "Transport created",
    },
    { status: 201 }
  );
};

export const GET = async (req: NextRequest) => {
  const transports = await prisma.transport.findMany({
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
    return NextResponse.json(
      {
        error: "Nie znaleziono transportów",
      },
      { status: 422 }
    );
  }

  return NextResponse.json({ transports }, { status: 200 });
};
