import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-medium transition rounded-xl active:scale-[0.98]";
    const variants: Record<string, string> = {
      default: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20",
      secondary: "bg-white border border-slate-200 hover:bg-slate-50 text-slate-800",
      ghost: "bg-transparent hover:bg-white/40 text-slate-900",
    };
    const sizes: Record<string, string> = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-5 text-lg",
    };
    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
    );
  }
);
Button.displayName = "Button";


