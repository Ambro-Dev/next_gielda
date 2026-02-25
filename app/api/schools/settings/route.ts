import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { auth } from "@/auth";

export const GET = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const schoolId = req.nextUrl.searchParams.get("id");

  if (!schoolId) {
    return NextResponse.json({ error: "Brakuje ID szkoły", status: 400 });
  }

  const school = await prisma.school.findUnique({
    where: {
      id: schoolId,
    },
    select: {
      id: true,
      name: true,
      administrators: {
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
          name: true,
          surname: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      isActive: true,
      accessExpires: true,
    },
  });

  if (!school) {
    return NextResponse.json({ error: "Szkoła nie istnieje", status: 404 });
  }

  return NextResponse.json({
    school: school,
    status: 200,
  });
};
