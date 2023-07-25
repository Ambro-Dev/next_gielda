import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";

export const GET = async (req: NextRequest) => {
  const schools = await prisma.school.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  if (!schools) {
    return NextResponse.json({ error: "No schools found", status: 422 });
  }

  return NextResponse.json({ schools, status: 200 });
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { name, administratorId } = body;

  const school = await prisma.school.create({
    data: {
      name,
      administratorId,
    },
  });

  if (!school) {
    return NextResponse.json({ error: "Error creating school", status: 422 });
  }

  return NextResponse.json(school, { status: 200 });
};
