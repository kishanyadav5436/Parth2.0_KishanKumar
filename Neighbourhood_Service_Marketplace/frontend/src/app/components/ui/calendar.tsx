"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center w-full text-slate-900 dark:text-white font-black",
        caption_label: "text-sm font-black text-slate-900 dark:text-white",
        nav: "flex items-center gap-1 absolute inset-x-0 top-1 justify-between px-1 z-10",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-70 hover:opacity-100 dark:border-slate-800 dark:text-white rounded-lg",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-70 hover:opacity-100 dark:border-slate-800 dark:text-white rounded-lg",
        ),
        month_grid: "w-full border-collapse space-x-1",
        weekdays: "flex",
        weekday:
          "text-slate-400 dark:text-slate-500 rounded-md w-8 font-black text-[0.8rem] uppercase tracking-wider",
        week: "flex w-full mt-2",
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-blue-50 dark:[&:has([aria-selected])]:bg-blue-900/30 [&:has([aria-selected])]:rounded-md",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-semibold aria-selected:opacity-100 text-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white rounded-lg",
        ),
        range_start:
          "day-range-start aria-selected:bg-blue-600 aria-selected:text-white",
        range_end:
          "day-range-end aria-selected:bg-blue-600 aria-selected:text-white",
        selected:
          "[&>button]:bg-blue-600 [&>button]:text-white [&>button]:hover:bg-blue-600 [&>button]:hover:text-white [&>button]:focus:bg-blue-600 [&>button]:focus:text-white [&>button]:font-black [&>button]:shadow-md [&>button]:shadow-blue-600/30 [&>button]:rounded-lg",
        today: "[&>button]:bg-slate-100 dark:[&>button]:bg-slate-800 [&>button]:text-blue-600 dark:[&>button]:text-blue-400 [&>button]:font-black [&>button]:rounded-lg",
        outside:
          "text-slate-300 dark:text-slate-600 aria-selected:text-slate-400",
        disabled: "text-slate-300 dark:text-slate-600 opacity-40 cursor-not-allowed",
        range_middle:
          "aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30 aria-selected:text-blue-600 dark:aria-selected:text-blue-400",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevClassName, ...chevProps }) => {
          if (orientation === "left") {
            return <ChevronLeft className={cn("size-4", chevClassName)} {...chevProps} />;
          }
          return <ChevronRight className={cn("size-4", chevClassName)} {...chevProps} />;
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
