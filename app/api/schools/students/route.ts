import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  const schoolId = req.nextUrl.searchParams.get("schoolId");

  if (!schoolId) {
    return NextResponse.json({ error: "Missing schoolId" }, { status: 400 });
  }

  const students = await prisma.student.findMany({
    where: {
      schoolId: schoolId,
    },
    select: {
      name: true,
      surname: true,
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  if (!students) {
    return NextResponse.json({ error: "No students found" }, { status: 404 });
  }

  return NextResponse.json(students);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { username, schoolId, email } = await body;

  if (!username || !schoolId || !email) {
    return NextResponse.json(
      { error: "Brakuje wymaganych pól" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (user) {
    return NextResponse.json(
      { error: `Użytkownik o nazwie ${username} już istnieje` },
      { status: 400 }
    );
  }

  const password = Math.random().toString(36).slice(-8);
  const hashedPassword = bcrypt.hashSync(password, 10);

  const student = await prisma.student.create({
    data: {
      school: {
        connect: {
          id: schoolId,
        },
      },
      user: {
        create: {
          username: username,
          hashedPassword: hashedPassword,
          role: "student",
          email: email,
        },
      },
    },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not created" }, { status: 500 });
  }

  const studentReturn = {
    ...student,
    password: password,
  };

  return NextResponse.json(studentReturn);
}
