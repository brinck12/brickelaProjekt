"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];

interface CalendarProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
}

export function CustomCalendar({
  selectedDate,
  onSelect,
  disabled,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getMonthData = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const monthData = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startingDay) {
          week.push(null);
        } else if (day > daysInMonth) {
          week.push(null);
        } else {
          week.push(new Date(year, month, day));
          day++;
        }
      }
      monthData.push(week);
      if (day > daysInMonth) break;
    }

    return monthData;
  };

  const monthData = getMonthData(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (date: Date | null) => {
    if (date && (!disabled || !disabled(date))) {
      onSelect(date);
    }
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isDisabled = (date: Date | null) => {
    if (!date || !disabled) return false;
    return disabled(date);
  };

  return (
    <div className="w-full bg-barber-dark rounded-lg overflow-hidden border border-barber-secondary/20">
      <div className="flex justify-between items-center px-4 py-2 border-b border-barber-secondary/20">
        <button
          className="p-2 hover:bg-barber-secondary/20 rounded-md text-barber-accent"
          onClick={goToPreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-semibold text-barber-accent">
          {currentDate.toLocaleString("hu-HU", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          className="p-2 hover:bg-barber-secondary/20 rounded-md text-barber-accent"
          onClick={goToNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-barber-accent"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {monthData.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((date, dateIndex) => (
                <div
                  key={dateIndex}
                  className={`
                    h-10 flex items-center justify-center rounded-md cursor-pointer
                    ${
                      date && !isDisabled(date)
                        ? "hover:bg-barber-secondary/20"
                        : ""
                    }
                    ${
                      isToday(date)
                        ? "bg-barber-secondary/5 text-barber-accent font-bold"
                        : ""
                    }
                    ${
                      isSelected(date)
                        ? "bg-barber-accent text-barber-primary"
                        : "text-barber-light"
                    }
                    ${
                      isDisabled(date)
                        ? "opacity-50 cursor-not-allowed text-barber-secondary/50"
                        : ""
                    }
                  `}
                  onClick={() => handleDateClick(date)}
                >
                  {date ? date.getDate() : ""}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
