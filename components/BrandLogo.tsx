import { Scissors } from "lucide-react";

type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid size-10 place-items-center rounded-full bg-foreground text-background shadow-sm">
        <Scissors aria-hidden="true" className="size-5" strokeWidth={2.2} />
      </span>
      <span className="grid leading-tight">
        <span className="text-sm font-semibold tracking-normal sm:text-base">
          HairColor Formula
        </span>
        {!compact && (
          <span className="text-xs font-medium text-muted-foreground">
            美髮染髮配方助理
          </span>
        )}
      </span>
    </span>
  );
}
