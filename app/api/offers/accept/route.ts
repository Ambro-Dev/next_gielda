import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { auth } from "@/auth";

export const PUT = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { offerId, transportId } = body;
  const userId = session.user.id;

  if (!offerId || offerId === "" || offerId === "undefined") {
    return NextResponse.json({
      status: 400,
      error: "Brakuje parametru offerId",
    });
  }

  if (!transportId || transportId === "" || transportId === "undefined") {
    return NextResponse.json({
      status: 400,
      error: "Brakuje parametru transportId",
    });
  }

  // Verify that the accepting user is the transport owner
  const transport = await prisma.transport.findUnique({
    where: {
      id: String(transportId),
    },
    select: {
      isAccepted: true,
      creatorId: true,
    },
  });

  if (!transport) {
    return NextResponse.json({
      status: 404,
      error: "Nie znaleziono transportu",
    });
  }

  if (transport.creatorId !== userId) {
    return NextResponse.json({
      status: 403,
      error: "Tylko właściciel transportu może zaakceptować ofertę",
    });
  }

  if (transport.isAccepted) {
    return NextResponse.json({
      status: 400,
      error: "Transport został już zaakceptowany",
    });
  }

  const offer = await prisma.offer.update({
    where: {
      id: String(offerId),
      transport: {
        id: String(transportId),
        creator: {
          id: userId,
        },
      },
    },
    data: {
      isAccepted: true,
    },
  });

  if (!offer) {
    return NextResponse.json({
      status: 404,
      error: "Wystapił błąd podczas aktualizacji oferty",
    });
  }

  const updatedTransport = await prisma.transport.update({
    where: {
      id: String(transportId),
    },
    data: {
      isAvailable: false,
    },
  });

  if (!updatedTransport) {
    return NextResponse.json({
      status: 404,
      error: "Wystapił błąd podczas aktualizacji transportu",
    });
  }

  return NextResponse.json({
    status: 200,
    message: "Oferta została zaakceptowana",
  });
};
