import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export const GET = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

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

  if (user.role === "student") {
    const student = await prisma.student.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!student) {
      return NextResponse.json({
        error: "Nie znaleziono ucznia",
        status: 404,
      });
    }

    if (!student.name || !student.surname) {
      return NextResponse.json({
        user: {
          name: student.name,
          surname: student.surname,
        },
        error: "Uzupełnij dane konta",
        status: 402,
      });
    }

    return NextResponse.json({
      message: "Wszystko aktualne",
      user: {
        name: student.name,
        surname: student.surname,
      },
      status: 200,
    });
  }

  if (!user.name || !user.surname) {
    return NextResponse.json({
      user: {
        name: user.name,
        surname: user.surname,
      },
      error: "Uzupełnij dane konta",
      status: 402,
    });
  }

  return NextResponse.json({
    message: "Wszystko aktualne",
    user: {
      name: user.name,
      surname: user.surname,
    },
    status: 200,
  });
};

export const PUT = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = req.json();

  const { name, surname } = await body;

  const userId = session.user.id;

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

  if (!name || !surname) {
    return NextResponse.json({
      error: "Brakuje imienia lub nazwiska",
      status: 422,
    });
  }

  if (user.role === "student") {
    const updatedStudent = await prisma.student.update({
      where: {
        userId: user.id,
      },
      data: {
        name,
        surname,
      },
    });

    return NextResponse.json({
      message: "Dane zmienione prawidłowo",
      user: {
        name: updatedStudent.name,
        surname: updatedStudent.surname,
      },
      status: 200,
    });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name,
      surname,
    },
  });

  return NextResponse.json({
    message: "Dane zmienione prawidłowo",
    user: {
      name: updatedUser.name,
      surname: updatedUser.surname,
    },
    status: 200,
  });
};
