import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";
import { z } from "zod";

const createAdminSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  surname: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, name, surname } = createAdminSchema.parse(body);

    // Check if any admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: "admin"
      }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Administrator już istnieje w systemie" },
        { status: 400 }
      );
    }

    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Użytkownik o tej nazwie lub emailu już istnieje" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        username,
        email,
        hashedPassword,
        role: "admin",
        name,
        surname,
        emailVerified: new Date(),
        isBlocked: false,
      }
    });

    if (process.env.NODE_ENV === 'development') {
      console.log("✅ First admin user created successfully:", adminUser.username);
    }

    return NextResponse.json({ 
      message: "Administrator został utworzony pomyślnie",
      username: adminUser.username,
      email: adminUser.email
    }, { status: 201 });

  } catch (error) {
    console.error("❌ Error creating first admin user:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Nieprawidłowe dane", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Nie udało się utworzyć administratora" },
      { status: 500 }
    );
  }
}

