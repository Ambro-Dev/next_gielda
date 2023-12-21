"use client";

import React, { useEffect } from "react";

import {
  LargeBoxy,
  LargeFlat,
  LargeLow,
  LargeTanker,
} from "@/components/models/large-truck";
import {
  MediumBoxy,
  MediumLow,
  MediumTanker,
  MediumFlat,
} from "@/components/models/medium-truck";
import {
  SmallBoxy,
  SmallFlat,
  SmallLow,
} from "@/components/models/small-truck";
import Bus from "@/components/models/bus";
import { CarTrailerBox, CarTrailerLow } from "@/components/models/car-trailer";
import TypeSelector from "@/components/vehicles/type-selector";
import { VehicleVizualization } from "@/components/VehicleVisualization";
import { SizeChanger } from "@/components/vehicles/size-changer";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GoBack from "@/components/ui/go-back";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

type Props = {};

const formSchema = z.object({
  description: z
    .string()
    .min(20, {
      message: "Opis musi mieć co najmniej 20 znaków",
    })
    .max(2000, {
      message: "Opis może mieć maksymalnie 2000 znaków",
    }),
});

const TrailersTypes = [
  {
    id: "large_box",
    name: "Naczepa plandeka",
    size: [2.5, 2.7, 13.6],
    model: LargeBoxy,
    icon: "/vehicles/large-box.svg",
  },
  {
    id: "large_low",
    name: "Naczepa burtowa",
    size: [2.5, 0.5, 13.6],
    model: LargeLow,
    icon: "/vehicles/large-low.svg",
  },
  {
    id: "large_tanker",
    name: "Naczepa cysterna",
    size: [13.6, 1, 2.5],
    model: LargeTanker,
    icon: "/vehicles/large-tanker.svg",
  },
  {
    id: "large_flat",
    name: "Naczepa płaska",
    size: [2.5, 0.1, 13.6],
    model: LargeFlat,
    icon: "/vehicles/large-flat.svg",
  },
];

const MediumTypes = [
  {
    id: "medium_box",
    name: "Dostawczy od 12t - plandeka",
    size: [2.5, 2.7, 6.6],
    model: MediumBoxy,
    icon: "/vehicles/medium-box.svg",
  },
  {
    id: "medium_low",
    name: "Dostawczy od 12t - burtowa",
    size: [2.5, 0.5, 6.6],
    model: MediumLow,
    icon: "/vehicles/medium-low.svg",
  },
  {
    id: "medium_tanker",
    name: "Dostawczy od 12t - cysterna",
    size: [2.5, 1, 6.6],
    model: MediumTanker,
    icon: "/vehicles/medium-tanker.svg",
  },
  {
    id: "medium_flat",
    name: "Dostawczy od 12t - płaska",
    size: [2.5, 0.1, 6.6],
    model: MediumFlat,
    icon: "/vehicles/medium-flat.svg",
  },
];

const SmallTypes = [
  {
    id: "small_box",
    name: "Dostawczy do 12t - plandeka",
    size: [2.1, 2.4, 3.5],
    model: SmallBoxy,
    icon: "/vehicles/small-box.svg",
  },
  {
    id: "small_low",
    name: "Dostawczy do 12t - burtowa",
    size: [2.1, 0.5, 3.5],
    model: SmallLow,
    icon: "/vehicles/small-low.svg",
  },
  {
    id: "small_flat",
    name: "Dostawczy do 12t - płaska",
    size: [2.1, 0.1, 3.5],
    model: SmallFlat,
    icon: "/vehicles/small-flat.svg",
  },
];

const BusTypes = [
  {
    id: "bus",
    name: "Dostawczy do 3.5t - bus",
    size: [2.1, 1.8, 3.5],
    model: Bus,
    icon: "/vehicles/bus.svg",
  },
];

const CarTrailerTypes = [
  {
    id: "car_trailer_box",
    name: "Przyczepka samochodowa - plandeka",
    size: [1.8, 2, 2.8],
    model: CarTrailerBox,
    icon: "/vehicles/car-trailer-box.svg",
  },
  {
    id: "car_trailer_low",
    name: "Przyczepka samochodowa - burtowa",
    size: [1.8, 0.5, 2.5],
    model: CarTrailerLow,
    icon: "/vehicles/car-trailer-low.svg",
  },
];

const Vehicles = {
  trailers: TrailersTypes,
  medium: MediumTypes,
  small: SmallTypes,
  bus: BusTypes,
  carTrailer: CarTrailerTypes,
};

export type Vehicle = typeof Vehicles;

const Page = (props: Props) => {
  const [selectedVehicle, setSelectedVehicle] = React.useState<{
    id: string;
    name: string;
    size: number[];
    model: ({
      args,
      ...props
    }: {
      args: [number, number, number];
    }) => React.JSX.Element;
    icon: string;
  }>({
    id: "default",
    name: "Domyślny",
    size: [2.5, 2.7, 13.6],
    model: LargeBoxy,
    icon: "default",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  return (
    <Card>
      <GoBack clasName="m-3" />
      <Separator />
      <div className="w-full mt-3 mb-10 grid grid-cols-2 px-5">
        <div className="relative py-8 overflow-visible">
          <Progress
            className="absolute right-1.5 mt-10"
            value={
              selectedVehicle.id === "default"
                ? 10
                : form.formState.isValid
                ? 100
                : 66
            }
          />
          <div className="absolute top-6 mt-10 rounded-full right-0 bg-black w-6 h-6" />
          <div
            className={`absolute top-[33%] mt-10 rounded-full right-0  w-6 h-6 ${
              selectedVehicle.id === "default" ? "bg-secondary" : "bg-black"
            }`}
          />
          <div
            className={`absolute top-[66%] mt-10 rounded-full right-0  w-6 h-6 ${
              selectedVehicle.id === "default" ? "bg-secondary" : "bg-black"
            }`}
          />

          <div className="mr-10 grid grid-cols-1 grid-rows-3 gap-4">
            <TypeSelector
              vehicles={Vehicles}
              setSelectedVehicle={setSelectedVehicle}
            />
            {selectedVehicle.id !== "default" && (
              <>
                <SizeChanger
                  selectedVehicle={selectedVehicle}
                  setSelectedVehicle={setSelectedVehicle}
                />
                <Form {...form}>
                  <form>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opis</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="bg-white" />
                          </FormControl>
                          <FormDescription>
                            Opisz swój pojazd. Szczegółowy opis pomoże
                            potencjalnym zainteresowanym
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </>
            )}
          </div>
        </div>

        <div className="py-8 ml-2">
          {selectedVehicle && selectedVehicle.id !== "default" ? (
            <VehicleVizualization
              vehicleSize={selectedVehicle?.size as [number, number, number]}
              VehicleModel={
                selectedVehicle?.model as ({
                  args,
                  ...props
                }: {
                  args: [number, number, number];
                }) => React.JSX.Element
              }
              vehicleType={selectedVehicle?.id}
            />
          ) : (
            <span className="flex justify-center items-center bg-secondary rounded-md text-center h-full">
              Podgląd pojazdu pojawi się po wybraniu typu pojazdu
            </span>
          )}
        </div>
      </div>
      {form.formState.isValid && selectedVehicle.id !== "default" && (
        <div className="flex w-full justify-center items-center pb-6 z-10">
          <Button
            className="z-10"
            size="lg"
            disabled={
              !form.formState.isValid ||
              selectedVehicle.id === "default" ||
              form.formState.isSubmitting
            }
          >
            {form.formState.isSubmitting ? (
              <span>
                <Loader2 className="animate-spin mr-2" /> Dodawanie pojazdu
              </span>
            ) : (
              "Dodaj pojazd"
            )}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default Page;
