import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export const PUT = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin" && session.user.role !== "school_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();

  const { userId } = body;

  if (!userId) {
    return NextResponse.json({
      error: "Brakuje ID użytkownika",
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
      error: "Nie znaleziono użytkownika",
      status: 404,
    });
  }

  const password = Math.random().toString(36).slice(-12);

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      hashedPassword: hashedPassword,
    },
  });

  return NextResponse.json({
    user: {
      username: user.username,
      password: password,
    },
    message: "Hasło zostało zresetowane",
    status: 200,
  });
};
