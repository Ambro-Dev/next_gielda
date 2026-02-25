import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const transports = await prisma.transport.findMany({
    where: {
      creatorId: userId,
    },
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
      isAccepted: true,
      sendDate: true,
      receiveDate: true,
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
      polyline: true,
      start_address: true,
      end_address: true,
      distance: true,
      duration: true,
      sendTime: true,
      receiveTime: true,
      vehicle: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (transports.length === 0 || !transports) {
    return NextResponse.json({
      error: "Nie znaleziono transportów",
      status: 404,
    });
  }

  return NextResponse.json({ transports, status: 200 });
};
