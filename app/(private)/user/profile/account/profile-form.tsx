"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Nazwa użytkownika musi mieć co najmniej 2 znaki.",
    })
    .max(30, {
      message: "Nazwa użytkownika nie może mieć więcej niż 30 znaków.",
    })
    .optional(),
  email: z
    .string({
      required_error: "Email jest wymagany.",
    })
    .email()
    .optional(),
  bio: z
    .string()
    .max(160, {
      message: "Bio nie może mieć więcej niż 160 znaków.",
    })
    .min(4, {
      message: "Bio musi mieć co najmniej 4 znaki.",
    }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type Profile = {
  id: string;
  username: string;
  email: string;
  role: string;
  bio: string;
  school?: {
    id: string;
    name: string;
  };
  student?: {
    id: string;
    name: string;
    surname: string;
  };
};

export function ProfileForm({ profile }: { profile: Profile }) {
  // This can come from your database or API.
  const defaultValues: Partial<ProfileFormValues> = {
    bio: profile.bio || "Posiadam komputer",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Przesłałeś następujące wartości:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa użytkownika</FormLabel>
              <FormControl>
                <Input placeholder={profile.username} {...field} disabled />
              </FormControl>
              <FormDescription>
                Twoja nazwa użytkownika jest wyświetlana na Twoim profilu.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder={profile.email}
                {...field}
                disabled
              />
              <FormDescription>
                Twój adres email jest prywatny i widoczny tylko dla
                administratorów.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Posiadam komputer"
                  className="resize-none"
                  maxLength={160}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Powiedz nam coś o sobie. Możesz użyć do 160 znaków. Pozostało{" "}
                {160 - field.value.length} znaki(ów).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Zapisz</Button>
      </form>
    </Form>
  );
}
