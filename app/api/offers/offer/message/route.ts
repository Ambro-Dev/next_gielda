import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { auth } from "@/auth";

export const PUT = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { message, receiverId, offerId } = body;
  const senderId = session.user.id;

  if (!(message || senderId || receiverId || offerId)) {
    return NextResponse.json({ error: "Brak wymaganych pól" }, { status: 400 });
  }

  const sender = await prisma.user.findUnique({
    where: { id: senderId },
  });

  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });

  if (!(sender || receiver)) {
    return NextResponse.json(
      { error: "Nie znaleziono użytkownika" },
      { status: 404 }
    );
  }

  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
  });

  if (!offer) {
    return NextResponse.json(
      { error: "Nie znaleziono oferty" },
      { status: 404 }
    );
  }

  await prisma.offer.update({
    where: { id: offerId },
    data: {
      messages: {
        create: {
          text: message,
          sender: {
            connect: {
              id: senderId,
            },
          },
          receiver: {
            connect: {
              id: receiverId,
            },
          },
        },
      },
    },
  });

  const newMessage = await prisma.offerMessages.findFirst({
    where: {
      text: message,
      senderId: senderId,
      receiverId: receiverId,
    },
    select: {
      id: true,
      text: true,
      sender: {
        select: {
          id: true,
          surname: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          surname: true,
          email: true,
        },
      },
      createdAt: true,
    },
  });

  const offerKey = `offer:${offerId}:messages`;
  const receiverKey = `user:${receiverId}:messages`;

  // Socket.io notification is handled client-side via the socket provider

  return NextResponse.json({
    message: newMessage,
    status: 200,
  });
};
