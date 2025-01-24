"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { hu } from "date-fns/locale";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex items-center justify-between px-2",
        caption_label: "text-lg font-medium text-barber-accent",
        nav: "flex space-x-1",
        nav_button:
          "inline-flex items-center justify-center rounded-md text-barber-accent hover:bg-barber-secondary/20 p-2",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-barber-accent rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-barber-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-barber-secondary/20 rounded-md text-barber-light",
        day_selected:
          "bg-barber-accent text-barber-primary hover:bg-barber-accent hover:text-barber-primary focus:bg-barber-accent focus:text-barber-primary",
        day_today: "bg-barber-secondary/5 text-barber-accent font-bold",
        day_outside: "text-barber-secondary/50 opacity-50",
        day_disabled: "text-barber-secondary/50 opacity-50",
        day_range_middle:
          "aria-selected:bg-barber-accent aria-selected:text-barber-primary",
        day_hidden: "invisible",
        ...classNames,
      }}
      locale={hu}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
