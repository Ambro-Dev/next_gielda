import { LoginForm } from "./login-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

import React from "react";

const Login = () => {
  return (
    <div className="flex w-full min-h-[calc(100vh-8rem)] items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-xl shadow-card-lg lg:grid-cols-5">
        {/* Left branding panel */}
        <div className="hidden lg:flex lg:col-span-2 bg-navy flex-col items-center justify-center p-10 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary/10" />
          <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-primary/5" />

          <div className="relative z-10 flex flex-col items-center text-center gap-6">
            <Image
              src="/gielda-fenilo.webp"
              alt="Fenilo"
              width={180}
              height={50}
              className="brightness-0 invert"
              priority
            />
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Giełda Transportowa</h2>
              <p className="text-sm text-white/60 leading-relaxed">
                Zleć i znajdź transport szybko i przystępnie.
                Dołącz do tysięcy użytkowników Fenilo.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-6 text-xs text-white/40">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div>Transportów</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div>Użytkowników</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <Card className="lg:col-span-3 border-0 rounded-none lg:rounded-r-xl shadow-none">
          <CardHeader className="pt-8 pb-2">
            <div className="flex items-center gap-3 mb-2 lg:hidden">
              <Image
                src="/gielda-fenilo.webp"
                alt="Fenilo"
                width={120}
                height={34}
                priority
              />
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Logowanie do panelu
            </h2>
            <p className="text-sm text-muted-foreground">
              Wprowadź swoje dane, aby uzyskać dostęp do platformy
            </p>
          </CardHeader>
          <CardContent className="pb-8">
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
