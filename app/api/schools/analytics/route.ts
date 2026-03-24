import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { auth } from "@/auth";

export const GET = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const schoolId = req.nextUrl.searchParams.get("schoolId");
  if (!schoolId)
    return NextResponse.json({ error: "Missing schoolId" }, { status: 400 });

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [transports, offers, students, allStudents] = await Promise.all([
    prisma.transport.findMany({
      where: { schoolId },
      select: {
        id: true,
        createdAt: true,
        categoryId: true,
        vehicleId: true,
        category: { select: { name: true } },
        vehicle: { select: { name: true } },
      },
    }),
    prisma.offer.findMany({
      where: { transport: { schoolId } },
      select: {
        id: true,
        createdAt: true,
        brutto: true,
        isAccepted: true,
      },
    }),
    prisma.student.findMany({
      where: { schoolId },
      select: {
        id: true,
        createdAt: true,
        userId: true,
      },
    }),
    prisma.student.count({ where: { schoolId } }),
  ]);

  // Transport volume by month (last 12 months)
  const transportsByMonth: { month: string; count: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const monthLabel = monthStart.toLocaleDateString("pl-PL", {
      month: "short",
      year: "2-digit",
    });
    const count = transports.filter(
      (t) => t.createdAt >= monthStart && t.createdAt < monthEnd
    ).length;
    transportsByMonth.push({ month: monthLabel, count });
  }

  // Category distribution
  const categoryMap = new Map<string, number>();
  transports.forEach((t) => {
    const name = t.category.name;
    categoryMap.set(name, (categoryMap.get(name) || 0) + 1);
  });
  const categoryDistribution = Array.from(categoryMap.entries()).map(
    ([name, count]) => ({ name, count })
  );

  // Vehicle usage
  const vehicleMap = new Map<string, number>();
  transports.forEach((t) => {
    const name = t.vehicle.name;
    vehicleMap.set(name, (vehicleMap.get(name) || 0) + 1);
  });
  const vehicleUsage = Array.from(vehicleMap.entries()).map(
    ([name, count]) => ({ name, count })
  );

  // Student activity
  const studentUserIds = new Set(students.map((s) => s.userId));
  const activeStudents = transports.filter((t) =>
    studentUserIds.has(t.id)
  ).length;
  const newStudentsThisMonth = students.filter(
    (s) => s.createdAt >= currentMonthStart
  ).length;

  // Offers stats
  const offersByMonth: { month: string; count: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const monthLabel = monthStart.toLocaleDateString("pl-PL", {
      month: "short",
      year: "2-digit",
    });
    const count = offers.filter(
      (o) => o.createdAt >= monthStart && o.createdAt < monthEnd
    ).length;
    offersByMonth.push({ month: monthLabel, count });
  }

  const totalOffers = offers.length;
  const averageBrutto =
    totalOffers > 0
      ? Math.round(offers.reduce((sum, o) => sum + o.brutto, 0) / totalOffers)
      : 0;

  // Trends
  const prevMonthEnd = currentMonthStart;
  const transportsThisMonth = transports.filter(
    (t) => t.createdAt >= currentMonthStart
  ).length;
  const transportsPrevMonth = transports.filter(
    (t) => t.createdAt >= prevMonthStart && t.createdAt < prevMonthEnd
  ).length;
  const offersThisMonth = offers.filter(
    (o) => o.createdAt >= currentMonthStart
  ).length;
  const offersPrevMonth = offers.filter(
    (o) => o.createdAt >= prevMonthStart && o.createdAt < prevMonthEnd
  ).length;

  return NextResponse.json({
    transportsByMonth,
    categoryDistribution,
    vehicleUsage,
    studentActivity: {
      totalStudents: allStudents,
      activeStudents,
      newStudentsThisMonth,
    },
    offersStats: {
      totalOffers,
      averageBrutto,
      offersByMonth,
    },
    trends: {
      transportsThisMonth,
      transportsPrevMonth,
      offersThisMonth,
      offersPrevMonth,
    },
  });
};
