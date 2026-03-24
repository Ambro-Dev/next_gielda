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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";

import {
  MoreHorizontal,
  DeleteIcon,
  EditIcon,
  Plus,
  Search,
  type LucideIcon,
} from "lucide-react";

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
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";

type OptionParams = {
  options: {
    id: string;
    name: string;
  }[];
  route: string;
  title: string;
  description: string;
  noData: string;
  icon: LucideIcon;
  className?: string;
  dialog: {
    title: string;
    description: string;
    button: string;
    formName: string;
    formDescription: string;
  };
};

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Podaj nazwę.",
    })
    .regex(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/, {
      message: "Nazwa może zawierać tylko litery i cyfry.",
    })
    .transform((val) => val.trim()),
});

const formEditSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Podaj nazwę.",
    })
    .regex(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/, {
      message: "Nazwa może zawierać tylko litery i cyfry.",
    })
    .transform((val) => val.trim()),
});

export const OptionCard = (params: OptionParams) => {
  const router = useRouter();
  const [nowEditing, setNowEditing] = React.useState<{
    id: string;
    name: string;
  }>({ id: "", name: "" });
  const {
    options,
    title,
    route,
    description,
    noData,
    icon: Icon,
    className,
    dialog,
  } = params;
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [showNewSchoolDialog, setShowNewSchoolDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);

  const filteredOptions = options.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const formEdit = useForm({
    resolver: zodResolver(formEditSchema),
    defaultValues: {
      name: "",
    },
  });

  React.useEffect(() => {
    if (showEditDialog && nowEditing.name) {
      formEdit.reset({ name: nowEditing.name });
    }
  }, [showEditDialog, nowEditing.name, formEdit]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await axiosInstance.post(`/api/settings/${route}`, values);
    const data = res.data;
    if (data.message) {
      form.reset();
      setShowNewSchoolDialog(false);
      router.refresh();
      toast({
        title: "Sukces",
        description: data.message,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: data.error,
      });
    }
  };

  const onEdit = async (values: z.infer<typeof formEditSchema>) => {
    const res = await axiosInstance.put(`/api/settings/${route}`, {
      id: nowEditing.id,
      name: values.name,
    });
    const data = res.data;
    if (data.message) {
      formEdit.reset();
      setNowEditing({ id: "", name: "" });
      setShowEditDialog(false);
      router.refresh();
      toast({
        title: "Sukces",
        description: data.message,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: data.error,
      });
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/settings/${route}`,
      {
        method: "DELETE",
        body: JSON.stringify({ id }),
      }
    );
    const data = await res.json();
    if (data.message) {
      toast({
        title: "Sukces",
        description: data.message,
      });
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: data.error,
      });
    }
  };

  return (
    <Card
      className={cn(
        "flex flex-col shadow-card transition-smooth hover:shadow-card-hover",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {options.length}
            </Badge>
          </div>
          <CardDescription className="text-xs">{description}</CardDescription>
        </div>
        <div className="rounded-lg bg-primary/10 p-2.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        {options.length > 5 && (
          <div className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Szukaj..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>
        )}

        {options?.length > 0 ? (
          <div className="flex flex-col gap-1 max-h-[400px] overflow-auto">
            {filteredOptions.map((item, index) => (
              <div
                key={item.id}
                className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition-smooth hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-medium text-muted-foreground">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="sr-only">Otwórz menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <Dialog
                    open={showEditDialog}
                    onOpenChange={setShowEditDialog}
                  >
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DialogTrigger asChild>
                        <DropdownMenuItem
                          className="gap-4"
                          onClick={() => {
                            setNowEditing({ id: item.id, name: item.name });
                          }}
                        >
                          <EditIcon className="w-4 h-4" />
                          <span>Edytuj</span>
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DropdownMenuItem
                        className="text-red-500 font-bold gap-4"
                        onClick={() => handleDelete(item.id)}
                      >
                        <DeleteIcon className="w-4 h-4" />
                        <span>Usuń</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                    <DialogContent>
                      <Form {...formEdit}>
                        <form
                          onSubmit={formEdit.handleSubmit(onEdit)}
                          className="space-y-4"
                        >
                          <DialogHeader>
                            <DialogTitle>Edytuj</DialogTitle>
                            <DialogDescription>
                              Edytuj wprowadzoną nazwę.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-2 pb-4">
                            <FormField
                              control={formEdit.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Nowa nazwa</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="text"
                                      placeholder={item.name}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Podaj nową nazwę.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <DialogFooter>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  setNowEditing({ id: "", name: "" })
                                }
                              >
                                Anuluj
                              </Button>
                            </DialogTrigger>
                            <Button type="submit">Edytuj</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </DropdownMenu>
              </div>
            ))}
            {filteredOptions.length === 0 && searchQuery && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Brak wyników dla &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{noData}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Kliknij przycisk poniżej, aby dodać pierwszy element.
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3">
        <Dialog
          open={showNewSchoolDialog}
          onOpenChange={setShowNewSchoolDialog}
        >
          <DialogContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <DialogHeader>
                  <DialogTitle>{dialog.title}</DialogTitle>
                  <DialogDescription>{dialog.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{dialog.formName}</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                        <FormDescription>
                          {dialog.formDescription}
                        </FormDescription>
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
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => setShowNewSchoolDialog(true)}
            >
              <Plus className="h-4 w-4" />
              {dialog.button}
            </Button>
          </DialogTrigger>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
