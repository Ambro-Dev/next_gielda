import { LoginForm } from "./login-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import React from "react";

const Login = () => {
  return (
    <div className="flex w-full h-full lg:p-10 p-5 justify-center items-center">
      <Card className="p-5 mx-auto h-full w-full sm:w-4/5 md:w-3/5 xl:w-2/5 space-y-4">
        <CardHeader>
          <h2 className="text-xl font-bold tracking-tight">
            Logowanie do panelu
          </h2>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
