import dbConnect from '@/lib/dbConnect'
import User from '@/models/UserModel';
import { NextRequest, NextResponse } from 'next/server'


export async function GET(req: NextRequest) {
  await dbConnect();
  return NextResponse.json({hello: 'Hello, Next.js!'})
}

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.json();

  const user = await User.create(body);

  console.log(user);

  await user.save();
  return NextResponse.json({hello: 'User added!'})
}