import prisma from "@/lib/prismadb";
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
    message,
  } = body;

  if (
    !(
      currency ||
      vat ||
      netto ||
      brutto ||
      loadDate ||
      unloadDate ||
      unloadTime ||
      contactNumber ||
      creatorId ||
      transportId
    )
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const existingOffer = await prisma.offer.findFirst({
    where: {
      creatorId: creatorId,
      transportId: transportId,
    },
  });

  if (existingOffer) {
    return NextResponse.json(
      {
        error: "Wysłałeś/aś już ofertę dla tego transportu, edytuj istniejącą",
      },
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
      message: message ? message : undefined,
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
