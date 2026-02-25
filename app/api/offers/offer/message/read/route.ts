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
  const userId = session.user.id;

  if (!offerId) {
    return NextResponse.json({ error: "Brak offerId" }, { status: 400 });
  }

  await prisma.offerMessages.updateMany({
    where: {
      offerId,
      receiverId: userId,
      isRead: false,
    },
    data: { isRead: true },
  });

  return NextResponse.json({ message: "Wiadomości oznaczone jako przeczytane" }, { status: 200 });
};
