import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/UserModel";

interface NewUserRequest {
  username: string;
  email: string;
  password: string;
}

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as NewUserRequest;

  await dbConnect();

  const userExists = await User.findOne({ email: body.email });

  if (userExists) {
    return NextResponse.json({ error: "User already exists" }, { status: 422 });
  }

  const user = await User.create({ ...body });

  return NextResponse.json(
    {
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    },
    { status: 201 }
  );
};
