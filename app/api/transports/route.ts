import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

import type { NextTransportRequest } from "@/app/interfaces/Transports";

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

  console.log(transport);

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

export const GET = async (req: NextRequest) => {};
