import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavigationBar } from "./navigation-bar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Profil administratora",
  description:
    "Giełda transportowa - fenilo.pl - zleć i znajdź transport szybko i przystępnie.",
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col space-y-8 ">
      <NavigationBar />
      <div>{children}</div>
    </Card>
  );
}
