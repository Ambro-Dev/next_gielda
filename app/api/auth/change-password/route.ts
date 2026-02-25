import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export const PUT = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const { oldPassword, newPassword, newPasswordConfirmation } = body;
  const userId = session.user.id;

  if (!oldPassword || oldPassword === "" || oldPassword === "undefined") {
    return NextResponse.json({
      error: "Brakuje starego hasła",
      field: "oldPassword",
      status: 400,
    });
  }

  if (!newPassword || newPassword === "" || newPassword === "undefined") {
    return NextResponse.json({
      error: "Brakuje nowego hasła",
      field: "newPassword",
      status: 400,
    });
  }

  if (
    !newPasswordConfirmation ||
    newPasswordConfirmation === "" ||
    newPasswordConfirmation === "undefined"
  ) {
    return NextResponse.json({
      error: "Brakuje powtórzenia nowego hasła",
      field: "newPasswordConfirmation",
      status: 400,
    });
  }

  if (newPassword !== newPasswordConfirmation) {
    return NextResponse.json({
      error: "Nowe hasła nie są takie same",
      field: "newPasswordConfirmation",
      status: 400,
    });
  }

  if (newPassword.length < 8) {
    return NextResponse.json({
      error: "Nowe hasło jest za krótkie",
      field: "newPassword",
      status: 400,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return NextResponse.json({
      error: "Nie znaleziono użytkownika",
      status: 404,
    });
  }

  const isPasswordValid = await bcrypt.compare(
    oldPassword,
    user.hashedPassword,
  );

  if (!isPasswordValid) {
    return NextResponse.json({
      error: "Stare hasło jest niepoprawne",
      field: "oldPassword",
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      hashedPassword,
    },
  });

  return NextResponse.json({
    message: "Hasło zmienione prawidłowo",
    status: 200,
  });
};
