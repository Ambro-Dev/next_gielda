"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  clasName?: string;
};

const GoBack = (props: Props) => {
  const { clasName } = props;
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className={cn("", clasName)}
    >
      <ArrowLeft width={36} />
      <span>Powrót</span>
    </Button>
  );
};

export default GoBack;
