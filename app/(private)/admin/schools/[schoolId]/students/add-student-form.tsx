"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/axios";
import { UserPlus, CheckCircle2, Copy } from "lucide-react";

const noPolishCharsOrSpecialChars = /^[a-zA-Z0-9.]+$/;

const formSchema = z.object({
  username: z
    .string()
    .refine((value) => !/\.\.+/.test(value), {
      message: 'Nazwa użytkownika nie może zawierać ".."',
    })
    .refine((val) => !val.includes(" "), {
      message: "Nazwa użytkownika nie może zawierać spacji.",
    })
    .pipe(
      z
        .string()
        .regex(noPolishCharsOrSpecialChars, {
          message:
            "Nazwa użytkownika może zawierać tylko małe, wielkie litery i cyfry, bez polskich znaków.",
        })
        .min(3, {
          message: "Nazwa użytkownika musi mieć minimum 3 znaki.",
        })
        .max(30, {
          message: "Nazwa użytkownika może mieć maksymalnie 30 znaków.",
        })
    ),
  name: z
    .string({
      required_error: "Imię jest wymagane.",
    })
    .refine((value) => !/\.+/.test(value), {
      message: 'Imię nie może zawierać "."',
    })
    .refine((val) => !val.includes(" "), {
      message: "Imię nie może zawierać spacji.",
    })
    .pipe(
      z
        .string()
        .min(3, {
          message: "Imię musi mieć minimum 3 znaki.",
        })
        .max(30, {
          message: "Imię może mieć maksymalnie 30 znaków.",
        })
    ),
  surname: z
    .string({
      required_error: "Nazwisko jest wymagane.",
    })
    .refine((value) => !/\.+/.test(value), {
      message: 'Nazwisko nie może zawierać "."',
    })
    .refine((val) => !val.includes(" "), {
      message: "Nazwisko nie może zawierać spacji.",
    })
    .pipe(
      z
        .string()
        .min(3, {
          message: "Nazwisko musi mieć minimum 3 znaki.",
        })
        .max(30, {
          message: "Nazwisko może mieć maksymalnie 30 znaków.",
        })
    ),
  email: z
    .string({
      required_error: "Adres email jest wymagany.",
    })
    .email({
      message: "Podaj poprawny adres email.",
    }),
});

type User = {
  password: string;
  username: string;
  email: string;
  role: string;
} | null;

function CopyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const { toast } = useToast();

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={value}
          readOnly
          className="bg-muted/50 text-sm"
        />
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0 shrink-0"
          onClick={() => {
            navigator.clipboard.writeText(value);
            toast({
              title: "Skopiowano",
              description: `${label} skopiowano do schowka.`,
            });
          }}
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export const AddStudentForm = ({ schoolId }: { schoolId: string }) => {
  const [createdUser, setCreatedUser] = React.useState<User>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [showNewSchoolDialog, setShowNewSchoolDialog] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      surname: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await axiosInstance.post(`/api/schools/students`, {
      ...values,
      schoolId,
    });
    const data = res.data;
    if (data.message) {
      setCreatedUser(data.user);
      form.reset();
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

  return (
    <Dialog open={showNewSchoolDialog} onOpenChange={setShowNewSchoolDialog}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Dodaj ucznia
        </Button>
      </DialogTrigger>
      <DialogContent>
        {!createdUser ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Nowy uczeń</DialogTitle>
                <DialogDescription>Uzupełnij wszystkie pola</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2 pb-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Nazwa użytkownika</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                      <FormDescription>Podaj nazwę użytkownika</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Imię</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                      <FormDescription>Podaj imię użytkownika</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Nazwisko</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                      <FormDescription>
                        Podaj nazwisko użytkownika
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Email użytkownika</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormDescription>Podaj email użytkownika</FormDescription>
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
        ) : (
          <div className="flex flex-col gap-5">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <DialogTitle>Uczeń dodany</DialogTitle>
                  <DialogDescription>
                    Skopiuj dane i wyślij do ucznia
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-3">
              <CopyField
                label="Nazwa użytkownika"
                value={createdUser.username}
              />
              <CopyField label="Email" value={createdUser.email} />
              <CopyField label="Hasło" value={createdUser.password} />
            </div>
            <Button
              onClick={() => {
                setShowNewSchoolDialog(false);
                setCreatedUser(null);
                router.refresh();
              }}
            >
              Gotowe
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
