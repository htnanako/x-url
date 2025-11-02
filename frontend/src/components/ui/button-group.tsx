import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'> {
  prefix?: React.ReactNode;
  children: React.ReactNode;
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, prefix, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center rounded-xl border bg-white/90 shadow-inner overflow-hidden",
          "border-slate-200",
          "dark:bg-slate-800/70 dark:border-slate-700",
          className
        )}
        {...props}
      >
        {prefix && (
          <div className="flex-[0.5] px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 truncate">
            {prefix}
          </div>
        )}
        <div className="flex-[0.5]">{children}</div>
      </div>
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";

