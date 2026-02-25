
import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  return <>{children}</>;
};

export default Layout;
