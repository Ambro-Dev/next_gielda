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
    return NextResponse.json({ error: "Missing required fields", status: 400 });
  }

  const existingOffer = await prisma.offer.findFirst({
    where: {
      creatorId: creatorId,
      transportId: transportId,
    },
  });

  if (existingOffer) {
    return NextResponse.json({
      error: "Wysłałeś/aś już ofertę dla tego transportu, edytuj istniejącą",
      status: 400,
    });
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

export const PUT = async (req: NextRequest) => {
  const body = await req.json();

  const {
    id,
    currency,
    vat,
    netto,
    brutto,
    loadDate,
    unloadDate,
    unloadTime,
    contactNumber,
    creatorId,
    message,
  } = body;

  if (
    !(
      id ||
      currency ||
      vat ||
      netto ||
      brutto ||
      loadDate ||
      unloadDate ||
      unloadTime ||
      contactNumber ||
      creatorId
    )
  ) {
    return NextResponse.json({ error: "Missing required fields", status: 400 });
  }

  const existingOffer = await prisma.offer.findFirst({
    where: {
      creatorId: creatorId,
      id: id,
    },
  });

  if (!existingOffer) {
    return NextResponse.json({
      error: "Brak oferty o podanym id",
      status: 400,
    });
  }

  const offer = await prisma.offer.update({
    where: {
      id: id,
    },
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
    },
  });

  return NextResponse.json({ message: "Oferta zaktualizowana", status: 201 });
};
