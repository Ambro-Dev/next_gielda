import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

type Props = {};

const Login = (props: Props) => {
  return (
    <div className="flex w-full h-full p-10 justify-center items-center">
      <Card className="p-5 w-3/5 mx-auto h-full">
        <Label>Email</Label>
        <Input placeholder="Email" />
        <Label>Password</Label>
        <Input placeholder="Password" />
      </Card>
    </div>
  );
};

export default Login;
