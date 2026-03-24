import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prismadb";
import { generateMapImage } from "@/lib/generate-map-image";

export const dynamic = "force-dynamic";

export const POST = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const transports = await prisma.transport.findMany({
    where: {
      OR: [{ mapImage: null }, { mapImage: { isSet: false } }],
    },
    select: {
      id: true,
      polyline: true,
      directions: {
        select: {
          start: { select: { lat: true, lng: true } },
          finish: { select: { lat: true, lng: true } },
        },
      },
    },
  });

  let succeeded = 0;
  let failed = 0;

  for (const transport of transports) {
    if (!transport.directions?.start || !transport.directions?.finish) {
      failed++;
      continue;
    }

    const mapImage = generateMapImage({
      transportId: transport.id,
      directions: {
        start: transport.directions.start,
        finish: transport.directions.finish,
      },
      polyline: transport.polyline,
    });

    if (mapImage) {
      await prisma.transport.update({
        where: { id: transport.id },
        data: { mapImage },
      });
      succeeded++;
    } else {
      failed++;
    }
  }

  return NextResponse.json({
    total: transports.length,
    succeeded,
    failed,
  });
};
