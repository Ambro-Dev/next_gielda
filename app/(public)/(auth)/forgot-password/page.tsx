import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ResetPassword from "./reset-password";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="flex w-full min-h-[calc(100vh-8rem)] items-center justify-center p-4 sm:p-6 lg:p-10">
      <Card className="p-5 mx-auto w-full sm:w-4/5 md:w-3/5 xl:w-2/5 space-y-4 shadow-card-lg">
        <CardHeader>
          <h2 className="text-xl font-bold tracking-tight">
            Resetowanie hasła
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Podaj swoją nazwę użytkownika, a wyślemy Ci link do resetowania hasła.
          </p>
        </CardHeader>
        <CardContent>
          <ResetPassword />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
