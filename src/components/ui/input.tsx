import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn("input", className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn("input min-h-[110px] resize-y", className)} {...props} />
));
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <span className="relative block">
    <select
      ref={ref}
      className={cn("input cursor-pointer appearance-none pr-10", className)}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      aria-hidden="true"
      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
      strokeWidth={1.5}
    />
  </span>
));
Select.displayName = "Select";

export function Field({
  label, htmlFor, required, hint, error, children, className,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  // The control is nested inside its label, so every field has an accessible
  // name without threading generated ids through a dozen forms.
  return (
    <label className={cn("block", className)} htmlFor={htmlFor}>
      <span className="label">
        {label}
        {required && <span className="ml-1 text-clay" aria-hidden="true">*</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1.5 block text-xs leading-relaxed text-ink-muted">{hint}</span>}
      {error && <span className="mt-1.5 block text-xs text-clay">{error}</span>}
    </label>
  );
}
