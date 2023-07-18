import TopBar from "@/components/TopBar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import { NextAuthProvider } from "./provider";
import MessengerChatBox from "@/components/MessengerChat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Giełda transportowa - fenilo.pl",
  description:
    "Giełda transportowa - fenilo.pl - zleć i znajdź transport szybko i przystępnie.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthProvider>
      <html lang="en">
        <body className={inter.className}>
          <main className="relative flex min-h-screen w-full flex-col bg-gray-100">
            <TopBar />
            <div className="lg:pt-36 pt-20 flex-grow mx-auto max-w-6xl w-full">
              {children}
            </div>
            <MessengerChatBox />

            <Footer />
          </main>
        </body>
      </html>
    </NextAuthProvider>
  );
}
