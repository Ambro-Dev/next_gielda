import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prismadb";

export const PUT = async (req: NextRequest) => {
  const body = await req.json();
  const {
    sendDate,
    vehicle,
    id,
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

  const existingTransport = await prisma.transport.findUnique({
    where: {
      id: id,
    },
  });

  if (!existingTransport) {
    return NextResponse.json({
      error: "Transport o podanych parametrach nie istnieje",
      status: 409,
    });
  }

  const transport = await prisma.transport.update({
    where: {
      id: id,
    },
    data: {
      description,
      objects: {
        deleteMany: {},
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
        update: directions,
      },
    },
  });

  if (!transport) {
    throw new Error("Błąd aktualizowania transportu");
  }

  return NextResponse.json({
    message: "Transport został zaaktualizowany",
    transportId: transport.id,
    status: 201,
  });
};
