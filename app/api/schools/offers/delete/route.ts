import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prismadb";
import { auth } from "@/auth";

export const PUT = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "school_admin" && session.user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();

  const { offerId } = body;

  if (!offerId) {
    return NextResponse.json(
      {
        error: "Brakuje id oferty",
      },
      { status: 400 }
    );
  }

  const offer = await prisma.offer.findUnique({
    where: {
      id: offerId,
    },
  });

  if (!offer) {
    return NextResponse.json(
      {
        error: "Nie znaleziono oferty",
      },
      { status: 404 }
    );
  }

  await prisma.offer.delete({
    where: {
      id: offerId,
    },
  });

  return NextResponse.json(
    {
      message: "Usunięto ofertę",
    },
    { status: 200 }
  );
};
