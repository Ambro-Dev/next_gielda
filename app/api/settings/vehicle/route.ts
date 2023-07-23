import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const vehicles = await prisma.vehicle.findMany();

  if (!vehicles) {
    return NextResponse.json({ error: "No vehicles found", status: 422 });
  }

  return NextResponse.json(vehicles, { status: 200 });
};
export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { name } = body;

  if (!name)
    return NextResponse.json({
      error: "No name for vehicle provided",
      status: 500,
    });

  const vehicle = await prisma.vehicle.create({
    data: {
      name,
    },
  });

  if (!vehicle) {
    return NextResponse.json({ error: "Error creating vehicle", status: 422 });
  }

  return NextResponse.json(vehicle, { status: 200 });
};
