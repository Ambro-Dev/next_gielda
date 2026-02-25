import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NewPassword from "./new-password";
import { axiosInstance } from "@/lib/axios";
import { notFound, redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    token: string;
  }>;
};

const checkToken = async (token: string) => {
  try {
    const response = await axiosInstance.get(
      `api/auth/check-token?token=${token}`
    );
    if (process.env.NODE_ENV === 'development') {
      console.log(response);
    }
    return true;
  } catch (error) {
    console.error(error);
    notFound();
  }
};

const Page = async ({ searchParams: searchParamsPromise }: Props) => {
  const { token } = await searchParamsPromise;
  await checkToken(token);
  return (
    <div className="flex w-full min-h-[calc(100vh-8rem)] items-center justify-center p-4 sm:p-6 lg:p-10">
      <Card className="p-5 mx-auto w-full sm:w-4/5 md:w-3/5 xl:w-2/5 space-y-4 shadow-card-lg">
        <CardHeader>
          <h2 className="text-xl font-bold tracking-tight">Nadaj nowe hasło</h2>
        </CardHeader>
        <CardContent>
          <NewPassword />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
