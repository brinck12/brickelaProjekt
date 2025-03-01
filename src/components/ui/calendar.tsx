"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { hu } from "date-fns/locale";
import { startOfDay } from "date-fns";

import { cn } from "@/lib/utils";

export type CalendarProps = Omit<
  React.ComponentProps<typeof DayPicker>,
  "mode" | "selected" | "onSelect"
> & {
  onDateSelect?: (date: Date | undefined) => void;
  selected?: Date;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onDateSelect,
  selected,
  ...props
}: CalendarProps) {
  const today = startOfDay(new Date());

  const disabledDays = {
    before: today,
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      disabled={disabledDays}
      mode="single"
      selected={selected}
      onSelect={onDateSelect}
      modifiersClassNames={{
        disabled:
          "text-barber-secondary/30 opacity-30 hover:bg-transparent cursor-not-allowed",
        selected: "bg-barber-accent text-barber-primary hover:bg-barber-accent",
      }}
      classNames={{
        root: "w-full",
        months: "flex flex-col",
        month: "space-y-4",
        caption: "flex justify-center relative items-center h-10",
        caption_label: "text-xl font-medium text-barber-accent",
        nav: "space-x-1 flex items-center absolute right-1",
        nav_button: cn(
          "inline-flex items-center justify-center rounded-md text-barber-accent hover:bg-barber-secondary/20 h-7 w-7",
          "opacity-75 hover:opacity-100 transition-opacity"
        ),
        nav_button_previous: "mr-1",
        nav_button_next: "",
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7",
        head_cell: cn(
          "text-barber-secondary/70 font-normal text-[0.8rem] text-center",
          "mb-2 uppercase tracking-wider"
        ),
        row: "grid grid-cols-7 gap-0",
        cell: cn(
          "p-0 relative focus-within:relative focus-within:z-20 h-9",
          "[&:has([aria-selected])]:bg-barber-accent/20"
        ),
        day: cn(
          "inline-flex items-center justify-center",
          "text-sm font-normal w-9 h-9",
          "text-barber-light hover:bg-barber-secondary/20 hover:text-barber-accent",
          "focus:bg-barber-accent focus:text-barber-primary",
          "aria-selected:opacity-100 transition-colors",
          "rounded-full cursor-pointer"
        ),
        day_selected:
          "bg-barber-accent text-barber-primary hover:bg-barber-accent hover:text-barber-primary focus:bg-barber-accent focus:text-barber-primary",
        day_today: "bg-barber-secondary/5 text-barber-accent font-semibold",
        day_outside: "text-barber-secondary/50 opacity-50",
        day_disabled:
          "text-barber-secondary/30 opacity-30 hover:bg-transparent cursor-not-allowed pointer-events-none",
        day_range_middle:
          "aria-selected:bg-barber-accent aria-selected:text-barber-primary",
        day_hidden: "invisible",
        ...classNames,
      }}
      locale={hu}
      formatters={{
        formatCaption: (date) => {
          const year = date.getFullYear();
          const month = date.toLocaleString("hu-HU", { month: "long" });
          return `${year} ${month.charAt(0).toUpperCase() + month.slice(1)}`;
        },
      }}
      weekStartsOn={1}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
