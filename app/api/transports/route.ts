import dbConnect from "@/lib/dbConnect";
import Transport from "@/models/TransportModel";
import { NextRequest, NextResponse } from "next/server";

interface NewTransportRequest {
  category: string;
  transportVehicle: string;
  type: string;
  timeAvailable: number;
  description: string;
  objects: {
    name: string;
    description: string;
    amount: number;
    weight: number;
    height: number;
    width: number;
    length: number;
  }[];
  directions: {
    start: {
      place: string;
      lat: number;
      lng: number;
    };
    finish: {
      place: string;
      lat: number;
      lng: number;
    };
  };
}

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as NewTransportRequest;

  await dbConnect();

  const transport = await Transport.create({ ...body });

  return NextResponse.json(
    {
      transport: {
        id: transport._id.toString(),
        category: transport.category,
        transportVehicle: transport.transportVehicle,
        type: transport.type,
        timeAvailable: transport.timeAvailable,
        description: transport.description,
        objects: transport.objects,
        directions: transport.directions,
      },
    },
    { status: 201 }
  );
};
