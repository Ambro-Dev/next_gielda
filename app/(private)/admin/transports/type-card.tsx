"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";

import { MoreHorizontal, DeleteIcon, EditIcon } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface Settings {
  id: string;
  name: string;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Podaj nazwę typu.",
  }),
});

export const TypeCard = () => {
  const [types, setTypes] = React.useState<Settings[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  async function fetchTypes() {
    setLoading(true);
    await axios
      .get<Settings[]>("/settings/type")
      .then((res) => {
        setTypes(res.data);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  React.useEffect(() => {
    fetchTypes();
  }, [loading]);

  const { toast } = useToast();

  const [open, setOpen] = React.useState(false);
  const [showNewSchoolDialog, setShowNewSchoolDialog] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await axios
      .post("/settings/type", {
        name: values.name,
      })
      .then((res) => {
        toast({
          title: "Sukces",
          description: res.data.message,
        });
        setShowNewSchoolDialog(false);
        form.reset();
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = async (id: string) => {
    await axios
      .delete(`/settings/type`, {
        data: {
          id: id,
        },
      })
      .then((res) => {
        toast({
          title: "Sukces",
          description: res.data.message,
        });
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };
  return (
    <Card>
      <Dialog open={showNewSchoolDialog} onOpenChange={setShowNewSchoolDialog}>
        <CardHeader className="p-5">
          <CardTitle>Typy transportu</CardTitle>
          <CardDescription>
            Dodaj, usuń lub edytuj typy transportu
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          {types?.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {types.map((type) => (
                <React.Fragment key={type.id}>
                  <div className="text-sm flex justify-between items-center">
                    {type.name}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Otwórz menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-4">
                          <EditIcon className="w-4 h-4" />
                          <span>Edytuj</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className=" text-red-500 font-bold gap-4"
                          onClick={() => handleDelete(type.id)}
                        >
                          <DeleteIcon className="w-4 h-4" />
                          <span>Usuń</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Separator className="my-2" />
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <div className="text-sm">Brak typów transportu</div>
              <Separator className="my-2" />
            </div>
          )}
          <DialogContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <DialogHeader>
                  <DialogTitle>Dodaj typ</DialogTitle>
                  <DialogDescription>
                    Dodaj nowy typ transportu
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Nazwa</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                        <FormDescription>Podaj nazwę kategorii</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewSchoolDialog(false)}
                  >
                    Anuluj
                  </Button>
                  <Button type="submit">Dodaj</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </CardContent>
        <CardFooter>
          <DialogTrigger asChild>
            <Button
              className="w-full"
              onClick={() => {
                setOpen(true);
                setShowNewSchoolDialog(true);
              }}
            >
              Dodaj typ
            </Button>
          </DialogTrigger>
        </CardFooter>
      </Dialog>
    </Card>
  );
};
