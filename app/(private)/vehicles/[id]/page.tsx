import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GoBack from "@/components/ui/go-back";
import { axiosInstance } from "@/lib/axios";
import { VehiclesTableType } from "@/lib/types/vehicles";
import { User2, MapPin, Truck, Package } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

import { VehicleIcons } from "@/lib/types/vehicles";
import VehicleMap from "./vehicle-map";
import { VehicleVizualization } from "@/components/VehicleVisualization";
import { VehicleModels } from "@/lib/types/vehicles";
import SendMessage from "./send-message";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const getVihicle = async (
  id: string
): Promise<
  VehiclesTableType & {
    user: {
      id: string;
      username: string;
      name: string;
      surname: string;
      school?: string;
      phoneNumber?: string | number;
    };
    allVehicles: number;
    allTransports: number;
  }
> => {
  try {
    const response = await axiosInstance.get(`api/vehicles/info?id=${id}`);
    return response.data;
  } catch (error) {
    notFound();
  }
};

const Page = async (props: Props) => {
  const { id: vehicleId } = await props.params;

  const vehicle = await getVihicle(vehicleId);

  const vehicleData = Object.values(VehicleModels).find(
    (item) => item.id === vehicle.type
  );

  return (
    <div className="py-6 space-y-4">
      <GoBack className="bg-white shadow-sm border border-gray-200" />
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
        {/* Owner card */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border border-gray-200">
                <AvatarFallback className="bg-gray-50">
                  <User2 className="w-6 h-6 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">
                  {vehicle.user.name} {vehicle.user.surname}
                </CardTitle>
                {vehicle.user.school && (
                  <p className="text-sm text-gray-500">{vehicle.user.school}</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-center justify-center gap-6 py-2 border-y border-gray-100">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Pojazdy</span>
                <span className="font-semibold text-sm">{vehicle.allVehicles}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Transporty</span>
                <span className="font-semibold text-sm">
                  {vehicle.allTransports || 0}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-0">
            <p className="text-xs text-gray-500 text-center">
              Wyślij wiadomość do właściciela pojazdu, aby skontaktować
              się w sprawie transportu.
            </p>
            <SendMessage userId={vehicle.user.id} vehicleId={vehicleId} />
          </CardFooter>
        </Card>

        {/* Vehicle info card */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2 flex items-center justify-center">
            <Image
              src={VehicleIcons[vehicle.type as keyof typeof VehicleIcons]}
              width={120}
              height={80}
              alt={vehicle.type}
            />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between gap-2 items-center text-sm">
                <span className="text-gray-500">Typ pojazdu:</span>
                <span className="font-medium text-end">{vehicle.name}</span>
              </div>
              <div className="flex justify-between gap-2 items-center text-sm">
                <span className="text-gray-500">Miejscowość:</span>
                <span className="font-medium text-end">{vehicle.place_address}</span>
              </div>
              <div className="flex justify-between gap-2 items-center text-sm">
                <span className="text-gray-500">Wymiary:</span>
                <span className="font-medium text-end">
                  {vehicle.width}m x {vehicle.height}m x {vehicle.length}m
                </span>
              </div>
              {vehicle.type.includes("tanker") ? (
                <>
                  <div className="flex justify-between gap-2 items-center text-sm">
                    <span className="text-gray-500">Promień cysterny:</span>
                    <span className="font-medium text-end">
                      {vehicle.height / 2} m
                    </span>
                  </div>
                  <div className="flex justify-between gap-2 items-center text-sm">
                    <span className="text-gray-500">Objętość:</span>
                    <span className="font-medium text-end">
                      {Math.round(
                        Math.PI *
                          ((vehicle.width / 2) * (vehicle.width / 2)) *
                          vehicle.length *
                          1000
                      )}{" "}
                      l
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between gap-2 items-center text-sm">
                    <span className="text-gray-500">Powierzchnia:</span>
                    <span className="font-medium text-end">
                      {Math.round(vehicle.width * vehicle.length)} m²
                    </span>
                  </div>
                  <div className="flex justify-between gap-2 items-center text-sm">
                    <span className="text-gray-500">Pojemność:</span>
                    <span className="font-medium text-end">
                      {Math.round(
                        vehicle.width * vehicle.length * vehicle.height
                      )}{" "}
                      m³
                    </span>
                  </div>
                </>
              )}
              {vehicle.type.includes("flat") ||
                (vehicle.type.includes("low") && (
                  <div className="flex justify-between gap-2 items-center text-sm">
                    <span className="text-gray-500">Powierzchnia:</span>
                    <span className="font-medium text-end">
                      {Math.round(vehicle.width * vehicle.length)} m²
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* 3D Visualization */}
        <Card className="lg:col-span-2 lg:row-span-2 border border-gray-200 shadow-sm sm:max-h-[500px] max-h-[300px]">
          <VehicleVizualization
            VehicleModel={vehicleData!.model}
            vehicleSize={[
              vehicle.type.includes("tanker")
                ? vehicle.length
                : vehicle.width,
              vehicle.type.includes("tanker")
                ? vehicle.height / 2
                : vehicle.height,
              vehicle.type === "medium_tanker"
                ? vehicle.length
                : vehicle.type.includes("tanker")
                ? vehicle.height / 2
                : vehicle.length,
            ]}
            vehicleType={vehicle.type}
          />
        </Card>

        {/* Map */}
        <Card className="lg:col-span-2 md:row-span-2 border border-gray-200 shadow-sm order-last sm:order-none">
          <VehicleMap
            point={{
              lat: vehicle.place_lat,
              lng: vehicle.place_lng,
            }}
          />
        </Card>

        {/* Description */}
        <Card className="lg:col-span-2 border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Opis pojazdu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 leading-relaxed">
              {vehicle.description}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
