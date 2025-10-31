import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border bg-white/90 px-4 py-3 pr-9 shadow-inner transition focus:outline-none focus:ring-4",
          "border-slate-200 focus:ring-indigo-200 placeholder-slate-400",
          // dark mode: 深色毛玻璃输入框
          "dark:bg-slate-800/70 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:ring-indigo-900/30",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";


