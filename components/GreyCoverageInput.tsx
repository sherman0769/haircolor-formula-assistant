import { GREY_PERCENTAGE_OPTIONS } from "@/lib/constants";
import type { GreyPercentage } from "@/lib/types";

type GreyCoverageInputProps = {
  greyPercentage: GreyPercentage;
  needsGreyCoverage: boolean;
  onGreyPercentageChange: (value: GreyPercentage) => void;
  onNeedsGreyCoverageChange: (value: boolean) => void;
};

export function GreyCoverageInput({
  greyPercentage,
  needsGreyCoverage,
  onGreyPercentageChange,
  onNeedsGreyCoverageChange,
}: GreyCoverageInputProps) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-sm font-medium text-foreground">白髮比例</span>
        <select
          value={greyPercentage}
          onChange={(event) =>
            onGreyPercentageChange(event.target.value as GreyPercentage)
          }
          className="mt-2 h-11 w-full rounded-md border border-border bg-panel px-3 text-sm outline-none focus:border-accent"
        >
          {GREY_PERCENTAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-start gap-3 rounded-md border border-border bg-panel p-3 text-sm">
        <input
          type="checkbox"
          checked={needsGreyCoverage}
          onChange={(event) =>
            onNeedsGreyCoverageChange(event.target.checked)
          }
          className="mt-1 size-4 accent-accent"
        />
        <span>需要白髮覆蓋</span>
      </label>
    </div>
  );
}
