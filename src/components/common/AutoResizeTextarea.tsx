import { useEffect, useRef } from "react";
import { cn } from "@/utils";

export function AutoResizeTextarea({
  className,
  value,
  onChange,
  placeholder,
}: {
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={1}
      className={cn("overflow-hidden bg-transparent outline-none", className)}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
