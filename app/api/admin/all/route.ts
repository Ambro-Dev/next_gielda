import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const countSchools = await prisma.school.count();
  const countStudents = await prisma.user.count({
    where: {
      role: "student",
    },
  });
  const countTransports = await prisma.transport.count();

  return NextResponse.json(
    {
      schools: countSchools,
      students: countStudents,
      transports: countTransports,
    },
    { status: 200 }
  );
};
