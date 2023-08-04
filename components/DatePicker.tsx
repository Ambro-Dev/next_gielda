"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { pl } from "date-fns/locale";

type Props = {
  onChange: (date: Date) => void;
};

export function DatePicker({ onChange }: Props) {
  const [date, setDate] = React.useState<Date | undefined>();

  React.useEffect(() => {
    if (date) {
      onChange(date);
    }
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP", { locale: pl })
          ) : (
            <span>Wybierz datę</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          locale={pl}
          disabled={(date) => date < new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}
