"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const GoBack = (props: Props) => {
  const router = useRouter();
  return (
    <Button variant="ghost" onClick={() => router.back()}>
      <ArrowLeft width={36} />
      <span>Powrót</span>
    </Button>
  );
};

export default GoBack;
