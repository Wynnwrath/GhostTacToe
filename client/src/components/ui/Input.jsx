import { forwardRef } from "react";

export const Input = forwardRef(({ className = "", error, ...props }, ref) => (
  <div className="flex flex-col gap-1">
    <input
      ref={ref}
      className={`w-full px-4 py-3 bg-gray-800 border ${
        error ? "border-red-500" : "border-gray-700"
      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors ${className}`}
      {...props}
    />
    {error && <span className="text-red-500 text-xs">{error}</span>}
  </div>
));
Input.displayName = "Input";
