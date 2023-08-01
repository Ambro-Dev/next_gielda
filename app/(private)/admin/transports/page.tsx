import { Metadata } from "next";
import React from "react";
import { OptionCard } from "./option-card";
import { axiosInstance } from "@/lib/axios";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
};

type Settings = {
  id: string;
  name: string;
};

const getVehicles = async () => {
  try {
    const res = await axiosInstance.get(`/api/settings/vehicles`);
    const data = res.data;
    return data.vehicles;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getCategories = async () => {
  try {
    const res = await axiosInstance.get(`/api/settings/categories`);
    const data = res.data;
    return data.categories;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getTypes = async () => {
  try {
    const res = await axiosInstance.get(`/api/settings/types`);
    const data = res.data;
    return data.types;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default async function DashboardPage() {
  const vehiclesData = getVehicles();
  const categoriesData = getCategories();
  const typesData = getTypes();

  const [vehicles, categories, types] = await Promise.all([
    vehiclesData,
    categoriesData,
    typesData,
  ]);

  const data = [
    {
      options: vehicles,
      route: "vehicles",
      title: "Pojazdy",
      description: "Dodaj, edytuj lub usuń pojazdy.",
      noData: "Brak pojazdów.",
      dialog: {
        title: "Dodaj pojazd",
        description: "Dodaj nowy pojazd.",
        button: "Dodaj",
        formName: "Nazwa pojazdu",
        formDescription: "Nazwa nowego pojazdu.",
      },
    },
    {
      options: categories,
      route: "categories",
      title: "Kategorie",
      description: "Dodaj, edytuj lub usuń kategorie.",
      noData: "Brak kategorii.",
      dialog: {
        title: "Dodaj kategorię",
        description: "Dodaj nową kategorię.",
        button: "Dodaj",
        formName: "Nazwa kategorii",
        formDescription: "Nazwa nowej kategorii.",
      },
    },
    {
      options: types,
      route: "types",
      title: "Typy",
      description: "Dodaj, edytuj lub usuń typy.",
      noData: "Brak typów.",
      dialog: {
        title: "Dodaj typ",
        description: "Dodaj nowy typ.",
        button: "Dodaj",
        formName: "Nazwa typu",
        formDescription: "Nazwa nowego typu.",
      },
    },
  ];

  return (
    <>
      <h3 className="font-bold pt-5 pl-10 text-2xl">Opcje transportów</h3>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 p-5">
        {data.map((item) => (
          <React.Fragment key={item.title}>
            <OptionCard {...item} />
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
