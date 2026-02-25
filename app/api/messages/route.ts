import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { auth } from "@/auth";

export const GET = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const messages = await prisma.message.findMany({
    where: {
      conversation: {
        users: {
          some: {
            id: userId,
          },
        },
        messages: {
          some: {
            senderId: {
              not: userId,
            },
            isRead: false,
          },
        },
      },
    },
    select: {
      id: true,
      createdAt: true,
      text: true,
      sender: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      conversation: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return NextResponse.json(messages, { status: 200 });
};
