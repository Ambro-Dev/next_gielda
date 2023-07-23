import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.NEXT_PUBLIC_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret", status: 422 });
  }

  const tag = request.nextUrl.searchParams.get("tag") || "default";
  revalidateTag(tag);
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
