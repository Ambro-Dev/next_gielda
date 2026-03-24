import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { auth } from "@/auth";

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toCsv(headers: string[], rows: string[][]): string {
  const BOM = "\uFEFF";
  const headerLine = headers.map(escapeCsvField).join(",");
  const dataLines = rows
    .map((row) => row.map(escapeCsvField).join(","))
    .join("\n");
  return BOM + headerLine + "\n" + dataLines;
}

export const GET = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = req.nextUrl;
  const schoolId = searchParams.get("schoolId");
  const type = searchParams.get("type");
  const format = searchParams.get("format") || "csv";
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!schoolId || !type)
    return NextResponse.json(
      { error: "Missing schoolId or type" },
      { status: 400 }
    );

  const dateFilter: { createdAt?: { gte?: Date; lte?: Date } } = {};
  if (from) dateFilter.createdAt = { ...dateFilter.createdAt, gte: new Date(from) };
  if (to) dateFilter.createdAt = { ...dateFilter.createdAt, lte: new Date(to) };

  if (type === "transports") {
    const transports = await prisma.transport.findMany({
      where: { schoolId, ...dateFilter },
      select: {
        id: true,
        description: true,
        createdAt: true,
        start_address: true,
        end_address: true,
        sendDate: true,
        receiveDate: true,
        isAvailable: true,
        isAccepted: true,
        category: { select: { name: true } },
        vehicle: { select: { name: true } },
        creator: { select: { username: true } },
        _count: { select: { objects: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (format === "json") {
      return NextResponse.json(transports);
    }

    const headers = [
      "ID",
      "Opis",
      "Kategoria",
      "Pojazd",
      "Adres nadania",
      "Adres odbioru",
      "Data nadania",
      "Data odbioru",
      "Tworca",
      "Przedmioty",
      "Dostepny",
      "Zaakceptowany",
      "Data utworzenia",
    ];
    const rows = transports.map((t) => [
      t.id,
      t.description,
      t.category.name,
      t.vehicle.name,
      t.start_address || "",
      t.end_address || "",
      t.sendDate.toISOString().slice(0, 10),
      t.receiveDate.toISOString().slice(0, 10),
      t.creator.username,
      String(t._count.objects),
      t.isAvailable ? "Tak" : "Nie",
      t.isAccepted ? "Tak" : "Nie",
      t.createdAt.toISOString().slice(0, 10),
    ]);

    return new NextResponse(toCsv(headers, rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="transporty_${schoolId}.csv"`,
      },
    });
  }

  if (type === "students") {
    const students = await prisma.student.findMany({
      where: { schoolId },
      select: {
        id: true,
        name: true,
        surname: true,
        phone: true,
        createdAt: true,
        user: {
          select: {
            username: true,
            email: true,
            isBlocked: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (format === "json") {
      return NextResponse.json(students);
    }

    const headers = [
      "ID",
      "Imie",
      "Nazwisko",
      "Telefon",
      "Login",
      "Email",
      "Zablokowany",
      "Data utworzenia",
    ];
    const rows = students.map((s) => [
      s.id,
      s.name || "",
      s.surname || "",
      s.phone || "",
      s.user.username,
      s.user.email || "",
      s.user.isBlocked ? "Tak" : "Nie",
      s.createdAt.toISOString().slice(0, 10),
    ]);

    return new NextResponse(toCsv(headers, rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="uczniowie_${schoolId}.csv"`,
      },
    });
  }

  if (type === "offers") {
    const offers = await prisma.offer.findMany({
      where: { transport: { schoolId }, ...dateFilter },
      select: {
        id: true,
        createdAt: true,
        brutto: true,
        netto: true,
        vat: true,
        currency: true,
        isAccepted: true,
        creator: { select: { username: true } },
        transport: {
          select: {
            description: true,
            category: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (format === "json") {
      return NextResponse.json(offers);
    }

    const headers = [
      "ID",
      "Transport",
      "Kategoria",
      "Tworca oferty",
      "Netto",
      "Brutto",
      "VAT %",
      "Waluta",
      "Zaakceptowana",
      "Data utworzenia",
    ];
    const rows = offers.map((o) => [
      o.id,
      o.transport.description,
      o.transport.category.name,
      o.creator.username,
      String(o.netto),
      String(o.brutto),
      String(o.vat),
      o.currency,
      o.isAccepted ? "Tak" : "Nie",
      o.createdAt.toISOString().slice(0, 10),
    ]);

    return new NextResponse(toCsv(headers, rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="oferty_${schoolId}.csv"`,
      },
    });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
};
