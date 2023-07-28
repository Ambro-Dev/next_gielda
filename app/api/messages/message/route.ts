import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { message, senderId, receiverId, transportId } = body;

  if (!(message || senderId || receiverId || transportId)) {
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

  const conversation = await prisma.conversation.create({
    data: {
      users: {
        connect: [{ id: senderId }, { id: receiverId }],
      },
    },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Nie udało się utworzyć konwersacji" },
      { status: 404 }
    );
  }

  const newMessage = await prisma.message.create({
    data: {
      text: message,
      sender: {
        connect: {
          id: senderId,
        },
      },
      transport: {
        connect: {
          id: transportId,
        },
      },
      conversation: {
        connect: {
          id: conversation.id,
        },
      },
    },
  });

  if (!newMessage) {
    return NextResponse.json(
      { error: "Nie udało się wysłać wiadomości" },
      { status: 404 }
    );
  }

  return NextResponse.json(newMessage, { status: 200 });
};
