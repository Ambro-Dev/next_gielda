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
    message,
    creator,
  } = body;

  if (
    !currency ||
    !vat ||
    !netto ||
    !brutto ||
    !loadDate ||
    !unloadDate ||
    !unloadTime ||
    !contactNumber ||
    creator
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
};
