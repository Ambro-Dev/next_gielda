import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { auth } from "@/auth";

export const GET = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      student: {
        select: {
          school: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({
      error: "Nie ma takiego użytkownika",
      status: 404,
    });
  }

  return NextResponse.json({ school: user.student?.school.id, status: 200 });
};
