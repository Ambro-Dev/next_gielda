"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { LoaderIcon, UserPlus, LogIn } from "lucide-react";
import { useEffect, useState } from "react";

const noPolishCharsOrSpecialChars = /^[a-zA-Z0-9.]+$/;

const loginFormSchema = z.object({
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
  password: z.string().min(8, {
    message: "Hasło musi mieć co najmniej 8 znaków.",
  }),
});

const adminFormSchema = z.object({
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
  email: z.string().email({
    message: "Nieprawidłowy adres email.",
  }),
  password: z.string().min(8, {
    message: "Hasło musi mieć co najmniej 8 znaków.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Potwierdzenie hasła musi mieć co najmniej 8 znaków.",
  }),
  name: z.string().min(1, {
    message: "Imię jest wymagane.",
  }),
  surname: z.string().min(1, {
    message: "Nazwisko jest wymagane.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Hasła nie są identyczne.",
  path: ["confirmPassword"],
});

// Function to check if admin exists
async function checkAdminExists() {
  try {
    const response = await fetch('/api/admin/check', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return !data.adminExists;
    }
    return false;
  } catch (error) {
    console.error('❌ Error checking admin existence:', error);
    return false;
  }
}

// Function to create first admin
async function createFirstAdmin(adminData: any) {
  try {
    const response = await fetch('/api/admin/create-first', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error: error.error };
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    return { success: false, error: 'Błąd połączenia z serwerem' };
  }
}

export function LoginForm() {
  const [loading, setLoading] = React.useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = React.useState(false);
  const [showAdminForm, setShowAdminForm] = React.useState(false);
  const [adminExists, setAdminExists] = React.useState(true);
  const router = useRouter();

  // Check if admin exists when component mounts
  useEffect(() => {
    const checkAdmin = async () => {
      const noAdmin = await checkAdminExists();
      setAdminExists(!noAdmin);
      setShowAdminForm(noAdmin);
    };
    checkAdmin();
  }, []);

  // 1. Define your forms.
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const adminForm = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      surname: "",
    },
  });

  // 2. Define submit handlers.
  const onLoginSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    const { username, password } = values;
    setLoading(true);
    const response = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (response?.error) {
      setLoading(false);
      if (response.error === "User not found") {
        loginForm.setError("username", {
          type: "manual",
          message: "Nazwa użytkownika jest nieprawidłowa.",
        });
      } else if (response.error === "Invalid password") {
        loginForm.setError("password", {
          type: "manual",
          message: "Hasło jest nieprawidłowe.",
        });
      } else {
        loginForm.setError("username", {
          type: "manual",
          message: response.error,
        });
      }
    } else {
      router.push("/");
    }
  };

  const onAdminSubmit = async (values: z.infer<typeof adminFormSchema>) => {
    setIsCreatingAdmin(true);
    const { confirmPassword, ...adminData } = values;
    
    const result = await createFirstAdmin(adminData);
    
    if (result.success) {
      // Admin created successfully, switch to login mode
      setShowAdminForm(false);
      setAdminExists(true);
      adminForm.reset();
      // Auto-login the created admin
      const response = await signIn("credentials", {
        username: adminData.username,
        password: adminData.password,
        redirect: false,
      });
      
      if (response?.ok) {
        router.push("/");
      }
    } else {
      adminForm.setError("username", {
        type: "manual",
        message: result.error || "Wystąpił błąd podczas tworzenia administratora.",
      });
    }
    
    setIsCreatingAdmin(false);
  };

  if (showAdminForm) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-amber-600 mb-2">
            <UserPlus className="inline-block mr-2" />
            Utwórz pierwszego administratora
          </h3>
          <p className="text-sm text-gray-600">
            W systemie nie ma jeszcze administratora. Utwórz konto administratora aby rozpocząć pracę.
          </p>
        </div>
        
        <Form {...adminForm}>
          <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={adminForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={adminForm.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwisko</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={adminForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa użytkownika</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormDescription>Nazwa użytkownika do logowania</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={adminForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={adminForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hasło</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={adminForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Potwierdź hasło</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="w-full flex justify-center items-center transition-all duration-500 bg-neutral-800">
              {isCreatingAdmin ? (
                <Button className="w-full" disabled>
                  <LoaderIcon className="animate-spin mr-2" />
                  <span className="text-white font-semibold">Tworzenie administratora...</span>
                </Button>
              ) : (
                <Button type="submit" className="w-full">
                  <UserPlus className="mr-2" />
                  Utwórz administratora
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
          <FormField
            control={loginForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa użytkownika</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormDescription>Wpisz swoją nazwę użytkownika.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hasło</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription>Wpisz swoje hasło.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <Link
              href="/forgot-password"
              className="text-sm text-neutral-600 hover:text-amber-500"
            >
              Zapomniałeś hasła?
            </Link>
          </div>
          <div className="w-full flex justify-center items-center transition-all duration-500 bg-neutral-800">
            {loading ? (
              <Button className="w-full" disabled>
                <LoaderIcon className="animate-spin mr-2" />
                <span className="text-white font-semibold">Logowanie...</span>
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                <LogIn className="mr-2" />
                Zaloguj
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

