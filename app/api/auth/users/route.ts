import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";

interface NewUserRequest {
  username: string;
  email: string;
  password: string;
}

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as NewUserRequest;

  const { username, email, password } = body;

  if (!username || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 422 });
  }

  const userExists = await prisma.user.findUnique({
    where: { username, email },
  });

  if (userExists) {
    return NextResponse.json(
      { error: "User with this username or email already exists" },
      { status: 422 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      hashedPassword,
    },
  });

  return NextResponse.json(
    {
      user,
    },
    { status: 201 }
  );
};
