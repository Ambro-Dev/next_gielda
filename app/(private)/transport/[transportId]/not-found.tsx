import { Card } from "@/components/ui/card";

import React from "react";
import NotFoundLottie from "./not-found-lottie";
import { Label } from "@/components/ui/label";
import GoBack from "@/components/ui/go-back";

type Props = {};

const NotFound = (props: Props) => {
  return (
    <Card className="relative flex-col grid md:grid-cols-2 grid-cols-1 gap-4 px-3 my-5 py-20 items-center justify-center">
      <GoBack clasName="absolute top-5 left-5" />
      <Label className="text-center text-2xl">
        Nie znaleziono transportu o podanym identyfikatorze
      </Label>
      <NotFoundLottie />
    </Card>
  );
};

export default NotFound;
