import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
  try {
    // Check if we're in build mode
    if (process.env.BUILD_MODE === "true") {
      return NextResponse.json({
        schools: 0,
        students: 0,
        transports: 0,
        status: 200,
      });
    }

    const countSchools = await prisma.school.count();
    const countStudents = await prisma.user.count({
      where: {
        role: "student",
      },
    });
    const countTransports = await prisma.transport.count();

    return NextResponse.json({
      schools: countSchools || 0,
      students: countStudents || 0,
      transports: countTransports || 0,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Błąd serwera", status: 500 });
  }
};
