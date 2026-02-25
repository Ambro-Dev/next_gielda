import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prismadb";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { transportId } = body;

  if (!transportId) {
    return NextResponse.json({ error: "Brakuje ID transportu", status: 400 });
  }

  const transport = await prisma.transport.findUnique({
    where: {
      id: transportId,
    },
  });

  if (!transport) {
    return NextResponse.json({
      error: "Nie znaleziono transportu",
      status: 404,
    });
  }

  if (transport.creatorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.transport.delete({
    where: {
      id: transportId,
    },
  });

  return NextResponse.json({
    message: "Proces usuwania przebiegł pomyślnie, transport usunięty",
    status: 200,
  });
}
