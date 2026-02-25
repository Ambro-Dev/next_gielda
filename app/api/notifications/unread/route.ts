import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { auth } from "@/auth";

export const GET = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [offers, offerMessages] = await Promise.all([
    // Unviewed offers on user's transports
    prisma.offer.findMany({
      where: {
        transport: {
          creatorId: userId,
        },
        isViewed: false,
        isAccepted: false,
      },
      select: {
        id: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        transport: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    // Unread offer messages for user
    prisma.offerMessages.findMany({
      where: {
        receiverId: userId,
        isRead: false,
      },
      select: {
        id: true,
        createdAt: true,
        text: true,
        senderId: true,
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        offer: {
          select: {
            id: true,
            creator: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const formattedOffers = offers.map((offer) => ({
    id: offer.id,
    createdAt: offer.createdAt.toISOString(),
    text: "",
    sender: offer.creator,
    receiver: { id: userId, username: "", email: "" },
    transport: { id: offer.transport.id },
  }));

  const formattedOfferMessages = offerMessages.map((msg) => ({
    ...msg,
    receiver: { id: userId, username: "", email: "" },
    conversation: undefined,
    transport: undefined,
  }));

  return NextResponse.json(
    { offers: formattedOffers, offerMessages: formattedOfferMessages },
    { status: 200 }
  );
};
