import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sendResetPassword from "@/app/lib/resetPassword";
import { checkRateLimit } from "@/lib/rate-limit";

export const POST = async (req: NextRequest) => {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!checkRateLimit(`forgot-password:${email}`, 3, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Zbyt wiele prób. Spróbuj ponownie za 15 minut." },
      { status: 429 },
    );
  }

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Nie ma użytkownika z tym adresem email" },
      { status: 400 },
    );
  }

  const resetToken = await prisma.resetToken.findFirst({
    where: {
      userId: user.id,
    },
  });

  const fiveteenMinutesDiff = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return diff / (1000 * 60);
  };

  if (resetToken) {
    if (fiveteenMinutesDiff(resetToken.createdAt) < 15) {
      return NextResponse.json(
        {
          message: "Hasło było resetowane kilka minut temu, spróbuj za 15 min",
        },
        { status: 401 },
      );
    }
    await prisma.resetToken.delete({
      where: {
        id: resetToken.id,
      },
    });
  }

  const newResetToken = await prisma.resetToken.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      expires: new Date(Date.now() + 1000 * 60 * 30), // 30 min
      token: bcrypt.hashSync(
        user.email + Date.now() + process.env.RESET_TOKEN_SALT,
        10,
      ),
    },
  });

  const link = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${newResetToken.token}`;

  await sendResetPassword({
    email: user.email,
    username: user.username,
    link,
  });

  return NextResponse.json(
    { message: "Wysłano email z linkiem do resetu hasła" },
    { status: 200 },
  );
};
