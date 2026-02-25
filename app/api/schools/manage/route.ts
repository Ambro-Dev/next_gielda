import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { auth } from "@/auth";

export const GET = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const schoolId = req.nextUrl.searchParams.get("schoolId");
  if (!schoolId || schoolId === "" || schoolId === "undefined") {
    return NextResponse.json({ error: "Missing schoolId" }, { status: 400 });
  }

  const school = await prisma.school.findUnique({
    where: {
      id: schoolId,
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          transports: true,
          students: true,
        },
      },
      administrators: {
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          surname: true,
        },
      },
      accessExpires: true,
    },
  });

  if (!school) {
    return NextResponse.json(
      { error: "Brak wyszukiwanej szkoły" },
      { status: 404 }
    );
  }

  const latestTransports = await prisma.transport.findMany({
    where: {
      schoolId: schoolId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    select: {
      id: true,
      description: true,
      createdAt: true,
      vehicle: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      creator: {
        select: {
          id: true,
          username: true,
        },
      },
      _count: {
        select: {
          objects: true,
        },
      },
    },
  });

  return NextResponse.json({ school, latestTransports });
};
