/**
 * Card Component
 * Container com efeito glassmorphism
 */
import { type HTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";

interface CardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart"
> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "glass" | "solid" | "outline";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      hover = false,
      padding = "md",
      variant = "glass",
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const baseClasses = "rounded-xl";

    const variantClasses = {
      glass: "glass",
      solid: "bg-dark-light border border-gray-800",
      outline: "border-2 border-primary/30 bg-transparent",
    };

    const paddingClasses = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`;

    if (hover) {
      return (
        <motion.div
          ref={ref}
          className={classes}
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
          {...(props as any)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export default Card;
