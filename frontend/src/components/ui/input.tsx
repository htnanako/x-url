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
          "border-slate-200 focus:ring-indigo-200",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";


