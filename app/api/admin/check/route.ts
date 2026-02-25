import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(request: NextRequest) {
  try {
    // Check if any admin user exists
    const adminExists = await prisma.user.findFirst({
      where: {
        role: "admin"
      },
      select: {
        id: true,
        username: true,
        email: true
      }
    });

    return NextResponse.json({
      adminExists: !!adminExists
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error checking admin existence:", error);
    return NextResponse.json(
      { error: "Failed to check admin existence" },
      { status: 500 }
    );
  }
}

