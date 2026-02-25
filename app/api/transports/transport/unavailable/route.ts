import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prismadb";

export const PUT = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { transportId } = body;
  const userId = session.user.id;

  if (
    transportId === "" ||
    transportId === "undefined" ||
    transportId === undefined
  ) {
    return NextResponse.json({
      error: "ID transportu nie zostało podane",
      status: 400,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return NextResponse.json({
      error: "Użytkownik nie istnieje",
      status: 400,
    });
  }

  const transport = await prisma.transport.findUnique({
    where: {
      id: transportId,
    },
  });

  if (!transport) {
    return NextResponse.json({
      error: "Transport nie istnieje",
      status: 400,
    });
  }

  await prisma.transport.update({
    where: {
      id: transportId,
    },
    data: {
      isAvailable: false,
    },
  });

  return NextResponse.json({
    message: "Transport został wyłączony",
    status: 200,
  });
};
