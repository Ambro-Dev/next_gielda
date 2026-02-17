import { NextRequest, NextResponse } from "next/server";
import generator from "generate-password";
import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";
import sendPasswordToNewUser from "@/app/lib/sendPasswordToNewUser";

type Student = {
  imie: string;
  nazwisko: string;
  email: string;
  telefon?: string;
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { school, students } = body;

    if (!school || !students) {
      return NextResponse.json({ error: "Brakuje wymaganych pól", status: 400 });
    }

    const schoolExists = await prisma.school.findUnique({
      where: { id: school },
    });

    if (!schoolExists) {
      return NextResponse.json({ error: "Nie znaleziono szkoły", status: 404 });
    }

    if (!students.length) {
      return NextResponse.json({ error: "Nie znaleziono uczniów", status: 404 });
    }

    const countStudents = await prisma.student.count({
      where: {
        school: {
          id: school,
        },
      },
    });

    const studentsToCreate = students.map((student: Student) => {
      return {
        school: {
          connect: {
            id: school,
          },
        },
        user: {
          create: {
            email: student.email,
            role: "student",
          },
        },
        name: student.imie,
        surname: student.nazwisko,
        phone: student.telefon ? String(student.telefon) : null,
      };
    });

    type StudentData = {
      school: {
        connect: {
          id: string;
        };
      };
      user: {
        create: {
          email: string;
          role: "student";
        };
      };
      name: string;
      surname: string;
      phone: string | null;
    };

    // Check which emails are already taken
    const emailCheckResults = await Promise.all(
      studentsToCreate.map(async (student: StudentData) => {
        const emailTaken = await prisma.user.findFirst({
          where: { email: student.user.create.email },
        });
        return { student, emailTaken: !!emailTaken };
      })
    );

    const correctStudents = emailCheckResults
      .filter((r) => !r.emailTaken)
      .map((r) => r.student);

    const invalidStudents = emailCheckResults
      .filter((r) => r.emailTaken)
      .map((r) => ({
        name_surname: `${r.student.name} ${r.student.surname}`,
        email: r.student.user.create.email,
        created: false,
        error: `Użytkownik o emailu ${r.student.user.create.email} już istnieje`,
      }));

    if (correctStudents.length === 0) {
      return NextResponse.json({
        error: "Wszystkie podane adresy email są już zajęte",
        status: 409,
      });
    }

    const createdStudents = await Promise.all(
      correctStudents.map(async (student: StudentData, index: number) => {
        const username = `${schoolExists.identifier}.student${
          countStudents + index + 1
        }`;

        const password = generator.generate({
          length: 12,
          numbers: true,
          symbols: true,
          uppercase: true,
          lowercase: true,
        });

        try {
          const createdStudent = await prisma.student.create({
            data: {
              ...student,
              user: {
                create: {
                  ...student.user.create,
                  username,
                  hashedPassword: bcrypt.hashSync(password, 10),
                },
              },
            },
          });

          if (createdStudent) {
            // Send email in background - don't block the response
            sendPasswordToNewUser({
              email: student.user.create.email,
              username,
              password,
              name: student.name,
            }).catch((emailError) => {
              console.error("Failed to send email to", student.user.create.email, emailError);
            });

            return {
              name_surname: `${student.name} ${student.surname}`,
              password: password,
              username: username,
              email: student.user.create.email,
              created: true,
            };
          }
        } catch (createError) {
          console.error("Failed to create student", student.user.create.email, createError);
          return {
            name_surname: `${student.name} ${student.surname}`,
            username: username,
            email: student.user.create.email,
            created: false,
            error: "Nie udało się utworzyć ucznia",
          };
        }
      })
    );

    const results = [...invalidStudents, ...createdStudents].filter(Boolean);

    return NextResponse.json(
      { message: "Utworzono uczniów", results },
      { status: 200 }
    );
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas importu", status: 500 },
      { status: 500 }
    );
  }
};
