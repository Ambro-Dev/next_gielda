import TopBar from "@/components/TopBar";
import "./globals.css";
import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import { auth } from "@/auth";

const barlow = Barlow({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow",
});
import Footer from "@/components/Footer";
import { NextAuthProvider } from "./context/authProvider";
import { Toaster } from "@/components/ui/toaster";
import { SocketProvider } from "./context/socket-provider";
import MessageProvider from "./context/message-provider";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";

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
  const session = await auth();
  return (
    <NextAuthProvider session={session}>
      <html lang="pl">
        <body className={`${barlow.variable} font-sans`}>
          <MessageProvider>
            <SocketProvider>
              <NextSSRPlugin
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
              <main className="relative flex min-h-screen w-full flex-col bg-background">
                <Toaster />
                <TopBar />

                <div className="pt-24 flex-grow mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
                  {children}
                </div>

                <Footer />
              </main>
            </SocketProvider>
          </MessageProvider>
        </body>
      </html>
    </NextAuthProvider>
  );
}
