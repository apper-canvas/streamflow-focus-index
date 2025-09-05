import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  children, 
  className = "", 
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white";
  const variants = error 
    ? "border-error focus:ring-error focus:border-error" 
    : "border-gray-300 focus:ring-primary focus:border-primary hover:border-gray-400";

  return (
    <select
      ref={ref}
      className={cn(baseStyles, variants, className)}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;