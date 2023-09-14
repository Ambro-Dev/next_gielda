"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import { Label } from "@radix-ui/react-dropdown-menu";
import { axiosInstance } from "@/lib/axios";
import { Hash } from "lucide-react";

export const BlockSchool = ({ schoolId }: { schoolId: string }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [showBlockSchool, setShowBlockSchool] = React.useState(false);

  const onSubmit = async () => {
    try {
      const res = await axiosInstance.put(`/api/schools/settings/block`, {
        schoolId: schoolId,
      });
      const data = res.data;
      if (data.message) {
        toast({
          title: "Sukces",
          description: data.message,
        });
        setShowBlockSchool(false);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Błąd",
          description: data.error,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się zablokować dostępu do szkoły",
      });
    }
  };

  return (
    <Dialog open={showBlockSchool} onOpenChange={setShowBlockSchool}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="destructive">
          Zablokuj dostęp
        </Button>
      </DialogTrigger>
      <DialogContent>
        <>
          <DialogHeader>
            <DialogTitle>
              Czy na pewno chcesz zablokować dostęp do szkoły?
            </DialogTitle>
            <DialogDescription>
              Po zablokowaniu dostępu do szkoły, użytkownicy nie będą mogli się
              zalogować.
            </DialogDescription>
          </DialogHeader>
          <div className="space-x-4">
            <DialogTrigger asChild>
              <Button variant="outline">Anuluj</Button>
            </DialogTrigger>
            <Button
              variant="outline"
              onClick={() => {
                onSubmit();
              }}
            >
              Zablokuj dostęp
            </Button>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
};
