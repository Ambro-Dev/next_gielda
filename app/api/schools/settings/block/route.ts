import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { auth } from "@/auth";

export const PUT = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();

  const { schoolId } = body;

  if (!schoolId) {
    return NextResponse.json({ error: "Brakuje wymaganych pól", status: 400 });
  }

  const school = await prisma.school.findUnique({
    where: {
      id: schoolId,
    },
  });

  if (!school) {
    return NextResponse.json({
      error: "Szkoła o takim ID nie istnieje",
      status: 422,
    });
  }

  const today = new Date();
  const yeasterday = new Date(today.setDate(today.getDate() - 1));

  await prisma.school.update({
    where: {
      id: schoolId,
    },
    data: {
      accessExpires: yeasterday,
      isActive: false,
    },
  });

  return NextResponse.json({
    message: "Dostęp został zamknięty",
    status: 200,
  });
};
