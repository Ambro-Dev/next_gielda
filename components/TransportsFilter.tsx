"use client";

import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import TransportsMap from "@/components/dashboard/transports-map";
import { Tags, Transport } from "@/app/(private)/transport/page";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Filter, FilterX } from "lucide-react";

type Props = {
  categories: Tags[];
  vehicles: Tags[];
  transports: Transport[];
};

const TransportsFilter = (props: Props) => {
  const router = useRouter();
  const { categories, vehicles, transports } = props;

  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    searchParams.getAll("category")
  );
  const [selectedVehicles, setSelectedVehicles] = React.useState<string[]>(
    searchParams.getAll("vehicle")
  );

  function handleCategoryChange(id: string) {
    if (selectedCategories.includes(id)) {
      router.push(
        `/transport?${searchParams.toString().replace(`category=${id}`, "")}`
      );
    } else {
      router.push(`/transport?${searchParams.toString()}&category=${id}`);
    }
  }

  function handleVehicleChange(id: string) {
    if (selectedVehicles.includes(id)) {
      router.push(
        `/transport?${searchParams.toString().replace(`vehicle=${id}`, "")}`
      );
    } else {
      router.push(`/transport?${searchParams.toString()}&vehicle=${id}`);
    }
  }

  useEffect(() => {
    if (selectedCategories.length === 0) {
      router.push(
        `/transport?${searchParams.toString().replace("category", "")}`
      );
    }
  }, [selectedCategories]);

  useEffect(() => {
    setSelectedCategories(searchParams.getAll("category"));
  }, [searchParams]);

  useEffect(() => {
    setSelectedVehicles(searchParams.getAll("vehicle"));
  }, [searchParams]);

  useEffect(() => {
    if (selectedVehicles.length === 0) {
      router.push(
        `/transport?${searchParams.toString().replace("vehicle", "")}`
      );
    }
  }, [selectedVehicles]);

  useEffect(() => {
    const filteredTransports = transports.filter((transport) => {
      if (selectedCategories.length === 0 && selectedVehicles.length === 0) {
        return true;
      }

      if (selectedCategories.length === 0) {
        return selectedVehicles.includes(transport.vehicle.id);
      }

      if (selectedVehicles.length === 0) {
        return selectedCategories.includes(transport.category.id);
      }

      return (
        selectedCategories.includes(transport.category.id) &&
        selectedVehicles.includes(transport.vehicle.id)
      );
    });

    setFilteredTransports(filteredTransports);
  }, [selectedCategories, selectedVehicles]);

  const [filteredTransports, setFilteredTransports] =
    React.useState<Transport[]>(transports);

  return (
    <div className="flex flex-col w-full xl:px-0 px-3 pb-10">
      <Link href="/transport/add">
        <Button
          className="rounded-full bg-amber-500 w-full transition-all duration-500"
          size="lg"
        >
          Dodaj ogłoszenie
        </Button>
      </Link>
      <div className="grid lg:grid-cols-2 grid-cols-1 w-full gap-4 py-7 px-3">
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-row gap-4">
            <Input className="w-full" type="text" placeholder="Skąd" />
            <Input className="w-full" type="text" placeholder="Dokąd" />
          </div>
        </div>

        <div className="flex justify-center flex-col items-center w-full gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="w-full hover:bg-neutral-800 bg-transparent border-2 hover:text-white border-neutral-800 text-black">
                  Szukaj przy trasie
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Wyszukaj ogłoszenia, których lokalizacje znajdują się w
                  pobliżu Twojej trasy. Wyszukane zostaną wyniki w odległości
                  ok. 10% długości Twojej trasy licząc w linii prostej, jednak
                  nie bliżej niż 5km i nie dalej niż 50km od trasy.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col w-full gap-4">
        <div className="lg:w-1/5 lg:visible collapse w-0 lg:h-auto h-0">
          <ScrollArea className="h-auto w-full rounded-md border lg:visible">
            <div className="p-4 flex lg:flex-col flex-row ">
              <h4 className="mb-4 text-sm font-semibold leading-none">
                Kategorie ogłoszeń
              </h4>
              {categories &&
                categories.map((category) => (
                  <React.Fragment key={category.id}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        onCheckedChange={() =>
                          handleCategoryChange(category.id)
                        }
                        checked={selectedCategories.includes(category.id)}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                      >
                        {category.name} {`(${category._count.transports})`}
                      </label>
                    </div>
                    <Separator className="my-2" />
                  </React.Fragment>
                ))}
            </div>
            <div className="p-4 flex lg:flex-col flex-row ">
              <h4 className="mb-4 text-sm font-semibold leading-none">
                Typy pojazdów
              </h4>
              {vehicles &&
                vehicles.map((vehicle) => (
                  <React.Fragment key={vehicle.id}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        onCheckedChange={() => handleVehicleChange(vehicle.id)}
                        checked={selectedVehicles.includes(vehicle.id)}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                      >
                        {vehicle.name} {`(${vehicle._count.transports})`}
                      </label>
                    </div>
                    <Separator className="my-2" />
                  </React.Fragment>
                ))}
            </div>
          </ScrollArea>
        </div>
        <div className="lg:collapse visible lg:w-0 w-full">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter size={20} className="mr-2" />
                Filtruj
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <ScrollArea className="h-auto w-full rounded-md border">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-semibold leading-none">
                    Kategorie ogłoszeń
                  </h4>
                  {categories &&
                    categories.map((category) => (
                      <React.Fragment key={category.id}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="terms"
                            onCheckedChange={() =>
                              handleCategoryChange(category.id)
                            }
                            checked={selectedCategories.includes(category.id)}
                          />
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                          >
                            {category.name} {`(${category._count.transports})`}
                          </label>
                        </div>
                        <Separator className="my-2" />
                      </React.Fragment>
                    ))}
                </div>
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-semibold leading-none">
                    Typy pojazdów
                  </h4>
                  {vehicles &&
                    vehicles.map((vehicle) => (
                      <React.Fragment key={vehicle.id}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="terms"
                            onCheckedChange={() =>
                              handleVehicleChange(vehicle.id)
                            }
                            checked={selectedVehicles.includes(vehicle.id)}
                          />
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                          >
                            {vehicle.name} {`(${vehicle._count.transports})`}
                          </label>
                        </div>
                        <Separator className="my-2" />
                      </React.Fragment>
                    ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
        <TransportsMap transports={filteredTransports} />
      </div>
    </div>
  );
};

export default TransportsFilter;
