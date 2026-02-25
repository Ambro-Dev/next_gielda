import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { auth } from "@/auth";

export const GET = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const offers = await prisma.offer.findMany({
    where: {
      transport: {
        creatorId: userId,
        isAvailable: true,
      },
      isAccepted: false,
    },
    select: {
      id: true,
      brutto: true,
      netto: true,
      createdAt: true,
      creator: {
        select: {
          id: true,
          username: true,
        },
      },
      currency: true,
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
          creator: {
            select: {
              id: true,
              username: true,
            },
          },
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
          sendDate: true,
          sendTime: true,
          vehicle: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!offers || offers.length === 0) {
    return NextResponse.json({
      error: "Nie znaleziono ofert dla użytkownika",
      status: 404,
    });
  }

  return NextResponse.json({ offers, status: 200 });
};
