import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const types = await prisma.type.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          transports: true,
        },
      },
    },
  });

  if (!types) {
    return NextResponse.json({
      error: "Nie znaleziono typów transportu",
      status: 422,
    });
  }

  return NextResponse.json({ types, status: 200 });
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { name } = body;

  if (!name)
    return NextResponse.json({
      error: "Brak nazwy dla typu",
      status: 500,
    });

  const lowerCaseName = name.toLowerCase();

  const existingType = await prisma.type.findFirst({
    where: {
      name: lowerCaseName,
    },
  });

  if (existingType) {
    return NextResponse.json({
      error: "Typ o tej nazwie już istnieje",
      status: 500,
    });
  }

  const type = await prisma.type.create({
    data: {
      name: lowerCaseName,
    },
  });

  if (!type) {
    return NextResponse.json({ error: "Błąd dodawania typu", status: 422 });
  }

  return NextResponse.json({
    message: "Typ transportu dodany prawidłowo",
    status: 200,
  });
};

export const PUT = async (req: NextRequest) => {
  const body = await req.json();

  const { id, name } = body;

  if (!id)
    return NextResponse.json({
      error: "Brak id dla typu",
      status: 500,
    });

  if (!name)
    return NextResponse.json({
      error: "Brak nazwy dla typu",
      status: 500,
    });

  const lowerCaseName = name.toLowerCase();

  const existingType = await prisma.type.findFirst({
    where: {
      name: lowerCaseName,
    },
  });

  if (existingType) {
    return NextResponse.json({
      error: "Typ o podanej nazwie już istnieje",
      status: 500,
    });
  }

  const type = await prisma.type.update({
    where: {
      id,
    },
    data: {
      name: lowerCaseName,
    },
  });

  if (!type) {
    return NextResponse.json({ error: "Błąd w zmianie nazwy", status: 422 });
  }

  const types = await prisma.type.findMany();

  return NextResponse.json({
    message: "Zmiana nazwy typu zakończona sukcesem",
    status: 200,
  });
};

export const DELETE = async (req: NextRequest) => {
  const body = await req.json();

  const { id } = body;

  if (!id)
    return NextResponse.json({
      error: "Brak id dla typu",
      status: 500,
    });

  const typeHasTransports = await prisma.transport.findMany({
    where: {
      typeId: id,
    },
  });

  if (typeHasTransports.length > 0) {
    return NextResponse.json({
      error: "Nie można usunąć typu, który jest przypisany do transportu",
      status: 500,
    });
  }

  const type = await prisma.type.delete({
    where: {
      id,
    },
  });

  if (!type) {
    return NextResponse.json({ error: "Błąd w usuwaniu typu", status: 422 });
  }

  return NextResponse.json({
    message: "Typ transportu usunięty prawidłowo",
    status: 200,
  });
};
