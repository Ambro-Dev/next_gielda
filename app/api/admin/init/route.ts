import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Check if admin user exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [{ username: "admin" }, { email: "admin@fenilo.pl" }],
      },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin user already exists" },
        { status: 200 },
      );
    }

    // Get admin credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@fenilo.pl";
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD environment variable is required" },
        { status: 500 },
      );
    }
    const adminName = process.env.ADMIN_NAME || "Admin";
    const adminSurname = process.env.ADMIN_SURNAME || "User";

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        username: adminUsername,
        email: adminEmail,
        hashedPassword: hashedPassword,
        role: "admin",
        name: adminName,
        surname: adminSurname,
        emailVerified: new Date(),
        isBlocked: false,
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("✅ Admin user created successfully:", adminUser.username);
    }

    return NextResponse.json(
      {
        message: "Admin user created successfully",
        username: adminUser.username,
        email: adminUser.email,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 },
    );
  }
}
