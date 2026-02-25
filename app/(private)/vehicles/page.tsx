import { VehiclesTableType } from "@/lib/types/vehicles";
import { axiosInstance } from "@/lib/axios";
import { Card } from "@/components/ui/card";
import GoBack from "@/components/ui/go-back";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Truck, Box } from "lucide-react";

async function getData(): Promise<VehiclesTableType[]> {
  try {
    const res = await axiosInstance.get("api/vehicles");
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Page() {
  const data = await getData();

  const totalVolume = data
    .reduce((acc, vehicle) => {
      return acc + vehicle.width * vehicle.height * vehicle.length;
    }, 0)
    .toFixed(1);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Moja Flota</h1>
          <p className="text-muted-foreground mt-1">
            Zarządzaj swoimi pojazdami i planuj załadunki.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/vehicles/add">
            <Plus className="mr-2 h-5 w-5" /> Dodaj nowy pojazd
          </Link>
        </Button>
      </div>

      {/* Dashboard Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Liczba pojazdów
            </p>
            <h3 className="text-2xl font-bold">{data.length}</h3>
          </div>
        </Card>
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 rounded-full">
            <Box className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Całkowita pojemność
            </p>
            <h3 className="text-2xl font-bold">{totalVolume} m³</h3>
          </div>
        </Card>
      </div>

      {/* Vehicles Grid */}
      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-24 text-center">
          <div className="bg-secondary/50 p-6 rounded-full mb-6">
            <Truck className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Brak pojazdów we flocie
          </h3>
          <p className="text-muted-foreground max-w-md mb-8">
            Nie dodałeś jeszcze żadnego pojazdu. Dodaj swój pierwszy pojazd, aby
            móc planować załadunki i przyjmować zlecenia.
          </p>
          <Button asChild size="lg">
            <Link href="/vehicles/add">
              <Plus className="mr-2 h-5 w-5" /> Dodaj pierwszy pojazd
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
