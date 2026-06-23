"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type PinInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
  autoFocus?: boolean;
  className?: string;
};

export function PinInput({
  length = 6,
  value,
  onChange,
  disabled,
  id,
  autoFocus,
  className,
}: PinInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(length, " ").slice(0, length).split("");

  function updateAt(index: number, char: string) {
    const next = digits.map((d, i) => (i === index ? char : d.trim())).join("").slice(0, length);
    onChange(next);
  }

  function handleChange(index: number, raw: string) {
    const char = raw.replace(/\D/g, "").slice(-1);
    updateAt(index, char);
    if (char && index < length - 1) refs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  }

  return (
    <div
      id={id}
      className={cn("flex flex-wrap gap-2 sm:gap-2.5", className)}
      role="group"
      aria-label="PIN digits"
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={i === 0 ? "new-password" : "off"}
          autoFocus={autoFocus && i === 0}
          maxLength={1}
          disabled={disabled}
          value={digits[i]?.trim() ?? ""}
          aria-label={`Digit ${i + 1} of ${length}`}
          className={cn(
            "h-12 w-11 sm:h-14 sm:w-12 rounded-xl border-2 border-border bg-background text-center text-xl font-bold tabular-nums shadow-sm",
            "transition-[border-color,box-shadow,background-color]",
            "focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/15 outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            digits[i]?.trim() ? "border-primary/40 bg-primary/5" : "",
          )}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}
