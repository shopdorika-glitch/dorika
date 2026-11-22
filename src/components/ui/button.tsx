import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "dark" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary: "btn-primary",
  dark: "btn-dark",
  outline: "btn-outline",
  ghost: "btn-ghost",
};
const sizes = { sm: "btn-sm", md: "btn-md", lg: "btn-lg" };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn("group", variants[variant], sizes[size], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
