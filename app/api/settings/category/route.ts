import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const categories = await prisma.category.findMany();

  if (!categories) {
    return NextResponse.json({ error: "No categories found", status: 422 });
  }

  return NextResponse.json(categories, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { name } = body;

  if (!name)
    return NextResponse.json({
      error: "No name for category provided",
      status: 500,
    });

  const category = await prisma.category.create({
    data: {
      name,
    },
  });

  if (!category) {
    return NextResponse.json({ error: "Error creating category", status: 422 });
  }

  return NextResponse.json(category, { status: 200 });
};
