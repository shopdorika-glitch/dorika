"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { faqItems, type FaqItem } from "@/lib/faq";

export function FaqAccordion({
  items = faqItems,
  defaultOpen = 0,
}: {
  items?: FaqItem[];
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className="border-t border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div key={item.q} className="border-b border-line">
            <h3>
              <button
                id={buttonId}
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="group flex w-full items-start justify-between gap-6 py-5 text-left"
              >
                <span
                  className={cn(
                    "font-display text-[1.05rem] leading-snug tracking-tight transition-colors sm:text-[1.15rem]",
                    isOpen ? "text-clay" : "text-ink group-hover:text-clay"
                  )}
                >
                  {item.q}
                </span>
                <span
                  className={cn(
                    "mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center border transition-all duration-300",
                    isOpen ? "rotate-45 border-clay text-clay" : "border-line-strong text-ink-muted group-hover:border-ink"
                  )}
                  aria-hidden="true"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-[62ch] pb-6 pr-10 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
