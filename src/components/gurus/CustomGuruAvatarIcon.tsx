import { Sparkles, Bot, Shield, Rocket, Scale } from "lucide-react";

export function CustomGuruAvatarIcon({
  iconId,
  className,
}: {
  iconId: string;
  className?: string;
}) {
  switch (iconId) {
    case "bot":
      return <Bot className={className} />;
    case "shield":
      return <Shield className={className} />;
    case "rocket":
      return <Rocket className={className} />;
    case "scale":
      return <Scale className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}
