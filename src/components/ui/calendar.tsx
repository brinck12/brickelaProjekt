"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns";
import { hu } from "date-fns/locale";

export type CalendarProps = {
  selected?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  className?: string;
};

const WeekDays = React.memo(() => {
  const weekDays = ["H", "K", "SZE", "CS", "P", "SZO", "V"];
  return (
    <div className="grid grid-cols-7 text-center">
      {weekDays.map((day) => (
        <div
          key={day}
          className="h-10 flex items-center justify-center text-black font-bold text-sm uppercase tracking-wider"
        >
          {day}
        </div>
      ))}
    </div>
  );
});

const CalendarCell = React.memo(
  ({
    day,
    monthStart,
    today,
    selected,
    currentMonth,
    onDateSelect,
    setCurrentMonth,
  }: {
    day: Date;
    monthStart: Date;
    today: Date;
    selected?: Date;
    currentMonth: Date;
    onDateSelect?: (date: Date | undefined) => void;
    setCurrentMonth: (date: Date) => void;
  }) => {
    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isBefore(day, today)) {
          if (!isSameMonth(day, currentMonth)) {
            setCurrentMonth(day);
          }
          onDateSelect?.(day);
        }
      },
      [day, today, currentMonth, onDateSelect, setCurrentMonth]
    );

    return (
      <div className="h-10 flex items-center justify-center">
        <button
          type="button"
          onClick={handleClick}
          disabled={isBefore(day, today)}
          className={`w-10 h-10 rounded-full flex items-center justify-center
          ${
            !isSameMonth(day, monthStart)
              ? "text-barber-secondary/50 opacity-50"
              : ""
          }
          ${
            isBefore(day, today)
              ? "text-barber-secondary/30 opacity-30 cursor-not-allowed"
              : "cursor-pointer hover:bg-barber-secondary/20 text-white"
          }
          ${
            isToday(day)
              ? "bg-barber-secondary/5 text-barber-accent font-semibold"
              : ""
          }
          ${
            selected && isSameDay(day, selected)
              ? "bg-barber-accent text-barber-light"
              : ""
          }
        `}
        >
          {format(day, "d")}
        </button>
      </div>
    );
  }
);

export function Calendar({
  selected,
  onDateSelect,
  className = "",
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = useMemo(() => startOfDay(new Date()), []);

  const prevMonth = useCallback(() => {
    setCurrentMonth(subMonths(currentMonth, 1));
  }, [currentMonth]);

  const nextMonth = useCallback(() => {
    setCurrentMonth(addMonths(currentMonth, 1));
  }, [currentMonth]);

  const renderHeader = useCallback(() => {
    return (
      <div className="flex justify-between items-center mb-4 px-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            prevMonth();
          }}
          className="p-2 rounded-full hover:bg-barber-secondary/20 text-barber-accent"
        >
          &lt;
        </button>
        <div className="text-xl font-medium text-barber-accent">
          {format(currentMonth, "yyyy MMMM", { locale: hu })}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            nextMonth();
          }}
          className="p-2 rounded-full hover:bg-barber-secondary/20 text-barber-accent"
        >
          &gt;
        </button>
      </div>
    );
  }, [currentMonth, prevMonth, nextMonth]);

  const renderCells = useCallback(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateRange = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    const rows: React.ReactNode[] = [];
    let days: React.ReactNode[] = [];

    dateRange.forEach((day, i) => {
      days.push(
        <CalendarCell
          key={day.toString()}
          day={day}
          monthStart={monthStart}
          today={today}
          selected={selected}
          currentMonth={currentMonth}
          onDateSelect={onDateSelect}
          setCurrentMonth={setCurrentMonth}
        />
      );

      if ((i + 1) % 7 === 0 || i === dateRange.length - 1) {
        rows.push(
          <div key={day.toString()} className="grid grid-cols-7 text-center">
            {days}
          </div>
        );
        days = [];
      }
    });

    return <div>{rows}</div>;
  }, [currentMonth, today, selected, onDateSelect]);

  return (
    <div className={`bg-barber-primary p-4 rounded-lg w-full ${className}`}>
      {renderHeader()}
      <div className="space-y-1">
        <WeekDays />
        {renderCells()}
      </div>
    </div>
  );
}
