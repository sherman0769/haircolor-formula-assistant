import type { ConfidenceLevel } from "@/lib/types";

const confidenceLabels: Record<ConfidenceLevel, string> = {
  high: "信心高",
  medium: "信心中",
  low: "信心低",
};

const confidenceClasses: Record<ConfidenceLevel, string> = {
  high: "border-emerald-300 bg-emerald-50 text-emerald-900",
  medium: "border-amber-300 bg-amber-50 text-amber-950",
  low: "border-red-300 bg-red-50 text-red-900",
};

type RiskBadgesProps = {
  warnings: string[];
  confidenceLevel: ConfidenceLevel;
};

export function RiskBadges({ warnings, confidenceLevel }: RiskBadgesProps) {
  return (
    <div className="space-y-3">
      <div
        className={`inline-flex rounded-md border px-3 py-1.5 text-sm font-semibold ${confidenceClasses[confidenceLevel]}`}
      >
        {confidenceLabels[confidenceLevel]}
      </div>
      <div className="flex flex-wrap gap-2">
        {warnings.length === 0 ? (
          <span className="rounded-md border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-900">
            未偵測到高風險條件
          </span>
        ) : (
          warnings.map((warning) => (
            <span
              key={warning}
              className="rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs leading-5 text-amber-950"
            >
              {warning}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
