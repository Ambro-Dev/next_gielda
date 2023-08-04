import TopBar from "@/components/TopBar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import { NextAuthProvider } from "./context/authProvider";
import MessengerChatBox from "@/components/MessengerChat";
import { Analytics } from "@vercel/analytics/react";
import { GoogleApiProvider } from "./context/googleApiProvider";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { axiosInstance } from "@/lib/axios";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Giełda transportowa - fenilo.pl",
  description:
    "Giełda transportowa - fenilo.pl - zleć i znajdź transport szybko i przystępnie.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthProvider>
      <html lang="pl">
        <body className={inter.className}>
          <Analytics />
          <main className="relative flex min-h-screen w-full flex-col bg-gray-100">
            <Toaster />
            <TopBar />
            <GoogleApiProvider>
              <div className="lg:pt-36 pt-20 flex-grow mx-auto max-w-6xl w-full">
                {children}
              </div>
            </GoogleApiProvider>
            <MessengerChatBox />

            <Footer />
          </main>
        </body>
      </html>
    </NextAuthProvider>
  );
}
