import prisma from "@/lib/prismadb";
import { Offer } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const {
    currency,
    vat,
    netto,
    brutto,
    loadDate,
    unloadDate,
    unloadTime,
    contactNumber,
    creatorId,
    transportId,
  }: Offer = body;

  if (
    !(
      currency &&
      vat &&
      netto &&
      brutto &&
      loadDate &&
      unloadDate &&
      unloadTime &&
      contactNumber &&
      creatorId &&
      transportId
    )
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const offer = await prisma.offer.create({
    data: {
      currency,
      vat,
      netto,
      brutto,
      loadDate,
      unloadDate,
      unloadTime,
      contactNumber,
      creator: {
        connect: {
          id: creatorId,
        },
      },
      transport: {
        connect: {
          id: transportId,
        },
      },
    },
  });

  return NextResponse.json({ message: "Oferta wysłana", status: 201 });
};
