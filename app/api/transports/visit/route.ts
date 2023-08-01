import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { transportId, userId } = body;

  if (
    !transportId ||
    !userId ||
    transportId === "" ||
    userId === "" ||
    userId === "undefined" ||
    transportId === "undefined"
  ) {
    return NextResponse.json({ error: "Brak wymaganych pól" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Nie znaleziono użytkownika" },
      { status: 404 }
    );
  }

  const transport = await prisma.transport.findUnique({
    where: { id: transportId },
  });

  const isTransportUser = await prisma.transport.findFirst({
    where: {
      id: transportId,
      creator: {
        id: userId,
      },
    },
  });

  if (isTransportUser) {
    return NextResponse.json(
      {
        message:
          "Transport odwiedzony przez właściciela nie zwiększa liczby odwiedzin",
      },
      { status: 201 }
    );
  }

  if (!transport) {
    return NextResponse.json(
      { error: "Nie znaleziono transportu" },
      { status: 404 }
    );
  }

  const newVisit = await prisma.visit.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      transport: {
        connect: {
          id: transportId,
        },
      },
    },
  });

  return NextResponse.json({
    message: "Dodano odwiedzenie strony",
    status: 200,
  });
};
