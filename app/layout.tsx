import TopBar from "@/components/TopBar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import { NextAuthProvider } from "./context/authProvider";
import { GoogleApiProvider } from "./context/googleApiProvider";
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
  return (
    <NextAuthProvider>
      <html lang="pl">
        <body>
          <GoogleApiProvider>
            <MessageProvider>
              <SocketProvider>
                <NextSSRPlugin
                  routerConfig={extractRouterConfig(ourFileRouter)}
                />
                <main className="relative flex min-h-screen w-full flex-col bg-gray-100">
                  <Toaster />
                  <TopBar />

                  <div className="lg:pt-36 pt-20 flex-grow mx-auto max-w-7xl px-1 w-full">
                    {children}
                  </div>

                  <Footer />
                </main>
              </SocketProvider>
            </MessageProvider>
          </GoogleApiProvider>
        </body>
      </html>
    </NextAuthProvider>
  );
}
