import clientPromise from "@/lib/mongodb";
import options from "@/app/api/auth/[...nextauth]/options";

import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.nextauth)
    return res.status(400).send("Missing nextauth query parameter");

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth.includes("signin");

  return await NextAuth(req, res, options);
}
