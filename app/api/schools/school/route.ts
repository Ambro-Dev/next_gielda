import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId || userId === "" || userId === "undefined") {
    return NextResponse.json({ error: "Missing schoolId" }, { status: 400 });
  }
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      school: {
        select: {
          id: true,
          administrator: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    return NextResponse.json({ error: "School not found" }, { status: 404 });
  }

  return NextResponse.json({ data }, { status: 200 });
};
