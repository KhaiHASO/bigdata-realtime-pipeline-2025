import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    // Base classes
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    // Variant classes - each unique (iOS 26 style)
    const variantClasses = {
      default: "bg-[#0A84FF] text-white shadow-md hover:bg-[#006fdd] active:scale-95 focus-visible:ring-[#0A84FF]",
      destructive: "bg-[#FF3B30] text-white shadow-md hover:bg-[#E6342A] active:scale-95 focus-visible:ring-[#FF3B30]",
      outline: "bg-white/40 backdrop-blur-xl border border-white/30 text-slate-900 hover:bg-white/50 active:scale-95 focus-visible:ring-[#0A84FF]",
      secondary: "bg-white/40 backdrop-blur-xl border border-white/30 text-slate-900 hover:bg-white/50 active:scale-95 focus-visible:ring-[#7D5FFF]",
      ghost: "hover:bg-white/30 text-slate-900 active:scale-95 focus-visible:ring-[#0A84FF]",
      link: "text-[#0A84FF] underline-offset-4 hover:underline focus-visible:ring-[#0A84FF]",
    };
    
    // Size classes - padding included to avoid conflicts
    const sizeClasses = {
      default: "h-10 px-6 py-3",
      sm: "h-9 px-4 py-2 text-xs",
      lg: "h-11 px-8 py-3 text-base",
      icon: "h-10 w-10 p-0",
    };
    
    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

