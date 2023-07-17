import { LoginForm } from "@/components/LoginForm";
import { Card } from "@/components/ui/card";

import React from "react";

const Login = () => {
  return (
    <div className="flex w-full h-full p-10 justify-center items-center">
      <Card className="p-5 w-3/5 mx-auto h-full">
        <LoginForm />
      </Card>
    </div>
  );
};

export default Login;
