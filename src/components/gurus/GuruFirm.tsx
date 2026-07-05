import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface GuruFirmProps extends HTMLAttributes<HTMLParagraphElement> {
  firm: string;
}

export function GuruFirm({ firm, className, ...props }: GuruFirmProps) {
  // 괄호 앞 기준으로 줄바꿈 파싱
  const formattedFirm = firm.includes("(") ? (
    <>
      <span className="block truncate">{firm.split("(")[0].trim()}</span>
      <span className="block truncate">({firm.split("(").slice(1).join("(")}</span>
    </>
  ) : (
    <span className="block truncate">{firm}</span>
  );

  return (
    <p className={cn("uppercase leading-snug tracking-widest text-zinc-500", className)} {...props}>
      {formattedFirm}
    </p>
  );
}
