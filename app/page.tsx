import React from "react";
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
import { axiosInstance } from "@/lib/axios";
import TransportsMap from "./transports-map";

type Tags = {
  id: string;
  name: string;
  _count: {
    transports: number;
  };
};

export type Transport = {
  id: string;
  sendDate: Date;
  receiveDate: Date;
  vehicle: { id: string; name: string };
  category: { id: string; name: string };
  type: { id: string; name: string };
  _count: {
    visits: number;
  };
  directions: {
    finish: {
      lat: number;
      lng: number;
    };
    start: {
      lat: number;
      lng: number;
    };
  };
  creator: { id: string; username: string };
};

const getCategories = async (): Promise<Tags[]> => {
  try {
    const res = await axiosInstance.get("/api/settings/categories");

    return res.data.categories;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getVehicles = async (): Promise<Tags[]> => {
  try {
    const res = await axiosInstance.get("/api/settings/vehicles");
    return res.data.vehicles;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getTransports = async (): Promise<Transport[]> => {
  try {
    const res = await axiosInstance.get("/api/transports");
    return res.data.transports;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default async function Home() {
  const categoriesData = getCategories();
  const vehiclesData = getVehicles();
  const transports = await getTransports();

  const [vehicles, categories] = await Promise.all<Tags[]>([
    vehiclesData,
    categoriesData,
  ]);

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
          <div className="w-full flex md:flex-row flex-col gap-4">
            <div className="w-full">
              <Select>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Wybierz kategorię ogłoszenia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Kategoria:</SelectLabel>
                    {categories &&
                      categories.map((category) => (
                        <SelectItem
                          className="capitalize"
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Select>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Wybierz typ pojazdu transportowego" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Pojazd:</SelectLabel>
                    {vehicles &&
                      vehicles.map((vehicle) => (
                        <SelectItem
                          className="capitalize"
                          key={vehicle.id}
                          value={vehicle.id}
                        >
                          {vehicle.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

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
                  Szukaj transportów
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Wyszukaj ogłoszenia z wybranym punktem początkowym i/lub
                  docelowym oraz/lub kategorią.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
        <div className="lg:w-1/5 lg:visible collapse">
          <ScrollArea className="h-auto w-full rounded-md border lg:visible collapse">
            <div className="p-4 flex lg:flex-col flex-row ">
              <h4 className="mb-4 text-sm font-medium leading-none">
                Kategorie ogłoszeń
              </h4>
              {categories &&
                categories.map((category) => (
                  <React.Fragment key={category.id}>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
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
          </ScrollArea>
        </div>
        <div className="lg:collapse visible lg:w-0 w-full">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <svg
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.55228 3 7ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12ZM9 17C9 16.4477 9.44772 16 10 16H14C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H10C9.44772 18 9 17.5523 9 17Z"
                      fill="#000000"
                    ></path>{" "}
                  </g>
                </svg>
                Kategorie ogłoszeń
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <ScrollArea className="h-auto w-full rounded-md border">
                <div className="p-4">
                  {categories &&
                    categories.map((category) => (
                      <React.Fragment key={category.id}>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="terms" />
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
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
        <TransportsMap transports={transports} />
      </div>
    </div>
  );
}
