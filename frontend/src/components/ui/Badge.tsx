/**
 * Badge Component
 * Badge para status e labels
 */
import { type HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

export default function Badge({
  variant = "primary",
  size = "md",
  dot = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const baseClasses =
    "inline-flex items-center gap-1.5 font-medium rounded-full";

  const variantClasses = {
    primary: "bg-primary/20 text-primary",
    secondary: "bg-secondary/20 text-secondary",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    error: "bg-error/20 text-error",
    info: "bg-info/20 text-info",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  const dotClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
    info: "bg-info",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <span className={classes} {...props}>
      {dot && (
        <span
          className={`w-2 h-2 rounded-full ${dotClasses[variant]} animate-pulse`}
        />
      )}
      {children}
    </span>
  );
}
