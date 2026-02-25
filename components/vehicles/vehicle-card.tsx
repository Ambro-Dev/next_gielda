import { VehiclesTableType, VehicleIcons } from "@/lib/types/vehicles";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin, Box, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface VehicleCardProps {
  vehicle: VehiclesTableType;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const volume = (vehicle.width * vehicle.height * vehicle.length).toFixed(1);
  const iconSrc =
    VehicleIcons[vehicle.type as keyof typeof VehicleIcons] ||
    "/vehicles/large-box.svg";

  return (
    <Card className="overflow-hidden flex flex-col transition-all hover:shadow border border-gray-200 shadow-sm">
      <div className="bg-gray-50 p-6 flex justify-center items-center h-48 relative">
        <Image
          src={iconSrc}
          alt={vehicle.name}
          width={200}
          height={133}
          className="object-contain drop-shadow-sm"
        />
        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium border">
          {volume} m³
        </div>
      </div>

      <CardHeader className="pb-2">
        <h3 className="font-semibold text-lg line-clamp-1" title={vehicle.name}>
          {vehicle.name}
        </h3>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
          <span className="line-clamp-1" title={vehicle.place_address}>
            {vehicle.place_address}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-4 flex-1">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col bg-gray-50 p-2 rounded-md">
            <span className="text-xs text-muted-foreground flex items-center mb-1">
              <Ruler className="w-3 h-3 mr-1" /> Wymiary
            </span>
            <span className="font-medium">
              {vehicle.length} x {vehicle.width} x {vehicle.height}m
            </span>
          </div>
          <div className="flex flex-col bg-gray-50 p-2 rounded-md">
            <span className="text-xs text-muted-foreground flex items-center mb-1">
              <Box className="w-3 h-3 mr-1" /> Typ
            </span>
            <span className="font-medium truncate" title={vehicle.type}>
              {vehicle.type.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        {vehicle.description && (
          <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
            {vehicle.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-0 gap-2 border-t p-4 bg-gray-50/50">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/vehicles/edit/${vehicle.id}`}>
            <Edit className="w-4 h-4 mr-2" /> Edytuj
          </Link>
        </Button>
        <Button variant="destructive" size="sm" className="flex-none px-3">
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
