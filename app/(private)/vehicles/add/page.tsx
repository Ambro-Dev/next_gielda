"use client";

import React, { useEffect } from "react";

import TypeSelector from "@/components/vehicles/type-selector";
import { VehicleVizualization } from "@/components/VehicleVisualization";
import { SizeChanger } from "@/components/vehicles/size-changer";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

import { AlertCircle, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import { LargeBoxy } from "@/components/models/large-truck";
import Vehicles from "@/lib/types/vehicles";
import { VehicleNames } from "@/lib/types/vehicles";
import PlaceSelector from "@/components/vehicles/place-selector";
import { useRouter } from "next/navigation";

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
  place: z.object(
    {
      lat: z.number(),
      lng: z.number(),
      formatted_address: z.string(),
    },
    {
      required_error: "Wybierz miejsce dostępności pojazdu",
      description: "Wybierz miejsce dostępności pojazdu",
    },
  ),
});

const Page = (props: Props) => {
  const [error, setError] = React.useState<string | null>(null);
  const session = useSession();

  const router = useRouter();

  function AlertDestructive() {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Błąd</AlertTitle>
        <AlertDescription>
          {error || "Wystąpił nieznany błąd. Spróbuj ponownie później"}
        </AlertDescription>
      </Alert>
    );
  }

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedVehicle.id === "default") {
      setTimeout(() => {
        setError("Wybierz typ pojazdu");
      }, 2000);
    }

    const userId = session.data?.user?.id;

    if (!userId || !selectedVehicle.id || userId.length !== 24) {
      toast({
        title: "Wystąpił błąd",
        description:
          "Wystąpił błąd podczas dodawania pojazdu, skontaktuj się z administratorem",
        variant: "destructive",
      });
      return;
    }

    const { description, place } = values;
    const { id, size } = selectedVehicle;

    //check if id is in VehicleNames
    if (!Object.keys(VehicleNames).includes(id)) {
      toast({
        title: "Wystąpił błąd",
        description:
          "Wystąpił błąd podczas dodawania pojazdu, skontaktuj się z administratorem",
        variant: "destructive",
      });
      return;
    }

    const data = {
      description,
      type: id,
      place,
      size: { width: size[0], height: size[1], length: size[2] },
      name: VehicleNames[id as keyof typeof VehicleNames],
      userId,
    };

    try {
      await axiosInstance.post("api/vehicles", data);
      setError(null);
      form.reset();
      toast({
        title: "Pojazd został dodany",
        description: "Twój pojazd został dodany do listy pojazdów",
      });
      router.push("/vehicles");
    } catch (error: any) {
      if (process.env.NODE_ENV === "development") {
        console.log(error);
      }
      toast({
        title: "Wystąpił błąd",
        description: error.response.data.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Left Side: 3D Visualization (70%) */}
      <div className="w-full lg:w-[70%] h-[50vh] lg:h-full relative bg-secondary/20 border-b lg:border-b-0 lg:border-r">
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
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <div className="w-24 h-24 mb-4 opacity-20">
              <svg
                xmlns="http://www.w3.org/.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                <path d="M15 18H9" />
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                <circle cx="17" cy="18" r="2" />
                <circle cx="7" cy="18" r="2" />
              </svg>
            </div>
            <p className="text-lg font-medium">Wybierz typ pojazdu</p>
            <p className="text-sm">Podgląd 3D pojawi się tutaj</p>
          </div>
        )}
      </div>

      {/* Right Side: Form Sidebar (30%) */}
      <div className="w-full lg:w-[30%] h-[50vh] lg:h-full overflow-y-auto flex flex-col bg-card">
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Konfiguracja pojazdu</h2>
          <GoBack className="m-0" />
        </div>

        <div className="p-6 space-y-8 flex-1">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              1. Typ pojazdu
            </h3>
            <TypeSelector
              vehicles={Vehicles}
              selectedVehicleId={selectedVehicle.id}
              setSelectedVehicle={setSelectedVehicle}
            />
          </div>

          {error && <AlertDestructive />}

          {selectedVehicle.id !== "default" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  2. Wymiary
                </h3>
                <SizeChanger
                  selectedVehicle={selectedVehicle}
                  setSelectedVehicle={setSelectedVehicle}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  3. Szczegóły
                </h3>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="place"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Miejsce dostępności</FormLabel>
                          <FormControl>
                            <PlaceSelector setPlace={field.onChange} />
                          </FormControl>
                          <FormDescription>
                            Gdzie pojazd będzie dostępny?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opis</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="resize-none h-24"
                              placeholder="Dodatkowe informacje o pojeździe..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer for Action Button */}
        <div className="sticky bottom-0 p-4 bg-card border-t mt-auto">
          <Button
            className="w-full"
            size="lg"
            disabled={
              !form.formState.isValid ||
              selectedVehicle.id === "default" ||
              form.formState.isSubmitting
            }
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center select-none">
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Zapisywanie...
              </span>
            ) : (
              "Dodaj pojazd do floty"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
