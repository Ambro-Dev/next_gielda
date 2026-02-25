import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { auth } from "@/auth";

export const POST = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const { place, content, file } = body;
  const userId = session.user.id;

  if (!place || !content) {
    return NextResponse.json(
      { error: "Brakuje wymaganych pól" },
      { status: 400 }
    );
  }

  const report = await prisma.report.create({
    data: {
      place,
      content,
      fileUrl: file,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  if (!report) {
    return NextResponse.json(
      {
        error: "Nie udało się dodać zgłoszenia",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    {
      message: "Pomyślnie dodano zgłoszenie",
    },
    {
      status: 200,
    }
  );
};

export const GET = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reports = await prisma.report.findMany({
    select: {
      id: true,
      place: true,
      content: true,
      createdAt: true,
      seen: true,
      user: {
        select: {
          id: true,
          student: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(
    {
      reports,
    },
    {
      status: 200,
    }
  );
};
