import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface GuruFirmProps extends HTMLAttributes<HTMLParagraphElement> {
  firm: string;
}

export function GuruFirm({ firm, className, ...props }: GuruFirmProps) {
  // 괄호 앞 기준으로 자르고 괄호 이후 내용(직함 등)은 깔끔한 디자인을 위해 제외
  const formattedFirm = firm.includes("(") ? firm.split("(")[0].trim() : firm;

  return (
    <p className={cn("truncate uppercase leading-snug tracking-widest text-zinc-500", className)} {...props}>
      {formattedFirm}
    </p>
  );
}
