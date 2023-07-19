"use client";

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

import axios from "axios";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import React, { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import CardWithMap from "@/components/CardWithMap";
import { useRouter } from "next/navigation";

import type { Transports } from "@/app/interfaces/Transports";

export default function Home() {
  const tags = [{ id: 1, name: "Samochody" }];

  const [data, setData] = useState<Transports[]>([]);

  const fetchData = async () => {
    await axios
      .get<Transports[]>("api/transports", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setData(res.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const router = useRouter();

  return (
    <div className="flex flex-col w-full xl:px-0 px-3 pb-10">
      <Button
        className="rounded-full bg-amber-500 w-full transition-all duration-500"
        size="lg"
        onClick={() => router.replace("/transport/add")}
      >
        Dodaj ogłoszenie
      </Button>
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
                    <SelectItem value="cars">Samochody</SelectItem>
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
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="automobile">Osobowy</SelectItem>
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
              {tags.map((tag) => (
                <React.Fragment key={tag.id}>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Samochody
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
                  {tags.map((tag) => (
                    <React.Fragment key={tag.id}>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Samochody
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
        <div className="grid md:grid-cols-2 grid-cols-1 gap-8 lg:w-4/5 w-full">
          {data &&
            data.map((item) => {
              return <CardWithMap key={item.id} transport={item} />;
            })}
        </div>
      </div>
    </div>
  );
}
