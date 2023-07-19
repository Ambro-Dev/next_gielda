import dbConnect from "@/lib/dbConnect";
import Transport from "@/models/TransportModel";
import { NextRequest, NextResponse } from "next/server";

import type { NextTransportRequest } from "@/app/interfaces/Transports";
import User from "@/models/UserModel";

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as NextTransportRequest;

  await dbConnect();

  const transport = await Transport.create({ ...body });

  return NextResponse.json(
    {
      transport: {
        id: transport._id.toString(),
        category: transport.category,
        transportVehicle: transport.transportVehicle,
        type: transport.type,
        sendDate: transport.sendDate,
        recieveDate: transport.recieveDate,
        timeAvailable: transport.timeAvailable,
        description: transport.description,
        objects: transport.objects,
        directions: transport.directions,
        creator: transport.creator,
      },
    },
    { status: 201 }
  );
};

export const GET = async (req: NextRequest) => {
  await dbConnect();

  const transports = await Transport.find({ isDeleted: false });

  const transportsWithUsers = await Promise.all(
    transports.map(async (transport) => {
      const user = await User.findById(transport.creator);
      return {
        id: transport._id.toString(),
        category: transport.category,
        transportVehicle: transport.transportVehicle,
        type: transport.type,
        sendDate: transport.sendDate,
        recieveDate: transport.recieveDate,
        creator: user?.username,
        timeAvailable: transport.timeAvailable,
        description: transport.description,
        objects: transport.objects,
        directions: transport.directions,
      };
    })
  );

  return NextResponse.json(transportsWithUsers, { status: 200 });
};
