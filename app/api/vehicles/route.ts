import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { description, size, userId, type, name, place } = body;

  if (!description || !size || !userId || !type || !name || !place) {
    return NextResponse.json(
      {
        error:
          "Brakuje wymaganych pól (pola wymagane: typ pojazdu, wymiary, ID użytkownika, opis, miejsce, nazwa)",
      },
      { status: 400 }
    );
  }

  const vehicle = await prisma.usersVehicles.create({
    data: {
      description,
      size,
      type,
      name,
      place,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  if (!vehicle) {
    return NextResponse.json(
      {
        error: "Nie udało się dodać pojazdu",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Pojazd został dodany" },
    { status: 200 }
  );
};

type VehiclesTableType = {
  id: string;
  name: string;
  width: number;
  height: number;
  length: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  type: string;
  place_address: string;
  place_lat: number;
  place_lng: number;
};

export const GET = async (req: NextRequest) => {
  const vehicles = await prisma.usersVehicles.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!vehicles) {
    const vehiclesTable: VehiclesTableType[] = [];
    return NextResponse.json(vehiclesTable, { status: 200 });
  }

  const vehiclesTable: VehiclesTableType[] = vehicles.map((vehicle) => {
    return {
      id: vehicle.id,
      name: vehicle.name,
      width: vehicle.type.includes("tanker")
        ? vehicle.size.height * 2
        : vehicle.size.width,
      height: vehicle.type.includes("tanker")
        ? vehicle.size.height * 2
        : vehicle.size.height,
      length:
        vehicle.type === "medium_tanker"
          ? vehicle.size.length
          : vehicle.type.includes("tanker")
          ? vehicle.size.width
          : vehicle.size.length,
      userId: vehicle.userId,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
      description: vehicle.description,
      type: vehicle.type,
      place_address: vehicle.place.formatted_address,
      place_lat: vehicle.place.lat,
      place_lng: vehicle.place.lng,
    };
  });

  return NextResponse.json(vehiclesTable, { status: 200 });
};
