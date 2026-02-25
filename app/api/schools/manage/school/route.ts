import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { auth } from "@/auth";

export const GET = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "school_admin" && session.user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const userId = session.user.id;

  const school = await prisma.school.findFirst({
    where: {
      administrators: {
        some: {
          id: userId,
        },
      },
    },
  });

  if (!school) {
    return NextResponse.json({
      error: "Użytkownik nie jest administratorem żadnej szkoły",
      status: 404,
    });
  }

  return NextResponse.json({ school, status: 200 });
};
