import dbConnect from '@/lib/dbConnect'
import User from '@/models/UserModel';
import { NextRequest, NextResponse } from 'next/server'
import { hashSync, genSaltSync } from 'bcrypt-ts';

function validateEmail(email: string) {
  const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return re.test(email);
}

const hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

export async function GET(req: NextRequest) {
  await dbConnect();
  return NextResponse.json({hello: 'Hello, Next.js!'})
}

export async function POST(req: NextRequest) {
  await dbConnect();
  
  const {name, email, password} = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({error: 'Please fill all fields'})
  }

  if (!validateEmail(email)) {
    return NextResponse.json({error: 'Please enter a valid email'})
  }

  const hashedPassword = hashPassword(password);

  const user = await User.create({name, email, password: hashedPassword});

  await user.save();
  return NextResponse.json({hello: 'User added!'})
}