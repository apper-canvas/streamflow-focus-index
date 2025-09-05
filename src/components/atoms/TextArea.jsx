import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const TextArea = forwardRef(({ 
  placeholder = "", 
  className = "", 
  rows = 3,
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed resize-vertical";
  const variants = error 
    ? "border-error text-error placeholder-error/50 focus:ring-error focus:border-error" 
    : "border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-primary focus:border-primary hover:border-gray-400";

  return (
    <textarea
      ref={ref}
      rows={rows}
      placeholder={placeholder}
      className={cn(baseStyles, variants, className)}
      {...props}
    />
  );
});

TextArea.displayName = "TextArea";

export default TextArea;