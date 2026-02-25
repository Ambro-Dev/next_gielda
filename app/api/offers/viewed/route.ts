import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { auth } from "@/auth";

export const PUT = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { offerId } = body;

  if (!offerId) {
    return NextResponse.json({ error: "Brak offerId" }, { status: 400 });
  }

  await prisma.offer.update({
    where: { id: offerId },
    data: { isViewed: true },
  });

  return NextResponse.json({ message: "Oferta oznaczona jako wyświetlona" }, { status: 200 });
};
