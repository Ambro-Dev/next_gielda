import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const conversationId = req.nextUrl.searchParams.get("conversationId");

  if (
    !conversationId ||
    conversationId === "" ||
    conversationId === "undefined"
  ) {
    return NextResponse.json({ error: "Brak parametru ID" }, { status: 400 });
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: String(conversationId),
    },
    select: {
      id: true,
      transport: {
        select: {
          id: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          description: true,
          isAvailable: true,
          createdAt: true,
          directions: {
            select: {
              start: {
                select: {
                  lat: true,
                  lng: true,
                },
              },
              finish: {
                select: {
                  lat: true,
                  lng: true,
                },
              },
            },
          },
          sendTime: true,
          sendDate: true,
          receiveTime: true,
          type: {
            select: {
              id: true,
              name: true,
            },
          },
          vehicle: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          createdAt: true,
          text: true,
          sender: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      users: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  if (!conversation || conversation.users.length === 0) {
    return NextResponse.json(
      { error: "Nie znaleziono konwersacji" },
      { status: 404 }
    );
  }

  return NextResponse.json(conversation);
};
