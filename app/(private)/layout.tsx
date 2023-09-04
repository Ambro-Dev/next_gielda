import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const PrivateLayout = async ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default PrivateLayout;
