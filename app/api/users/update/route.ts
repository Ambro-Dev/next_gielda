import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { auth } from "@/auth";

export const PUT = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  const body = await req.json();

  const { bio } = body;

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      bio,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        error: "user not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
};
