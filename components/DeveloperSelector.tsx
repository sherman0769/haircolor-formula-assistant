type DeveloperSelectorProps = {
  desiredTotalColorGrams: number | undefined;
  estimatedGrams: number;
  nearScalp: boolean;
  needsToning: boolean;
  acceptsHighRisk: boolean;
  onDesiredTotalColorGramsChange: (value: number | undefined) => void;
  onNearScalpChange: (value: boolean) => void;
  onNeedsToningChange: (value: boolean) => void;
  onAcceptsHighRiskChange: (value: boolean) => void;
};

export function DeveloperSelector({
  desiredTotalColorGrams,
  estimatedGrams,
  nearScalp,
  needsToning,
  acceptsHighRisk,
  onDesiredTotalColorGramsChange,
  onNearScalpChange,
  onNeedsToningChange,
  onAcceptsHighRiskChange,
}: DeveloperSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-foreground">
          預計總染膏重量
        </span>
        <input
          type="number"
          min={1}
          step={1}
          value={desiredTotalColorGrams ?? ""}
          placeholder={`${estimatedGrams}g 自動估算`}
          onChange={(event) => {
            const value = event.target.value;
            onDesiredTotalColorGramsChange(
              value === "" ? undefined : Number(value),
            );
          }}
          className="mt-2 h-11 w-full rounded-md border border-border bg-panel px-3 text-sm outline-none focus:border-accent"
        />
        <span className="mt-2 block text-xs leading-5 text-muted-foreground">
          留空會依髮長與髮量估算，目前估算 {estimatedGrams}g。
        </span>
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex items-start gap-3 rounded-md border border-border bg-panel p-3 text-sm">
          <input
            type="checkbox"
            checked={needsToning}
            onChange={(event) => onNeedsToningChange(event.target.checked)}
            className="mt-1 size-4 accent-accent"
          />
          <span>需要補色／中和</span>
        </label>
        <label className="flex items-start gap-3 rounded-md border border-border bg-panel p-3 text-sm">
          <input
            type="checkbox"
            checked={nearScalp}
            onChange={(event) => onNearScalpChange(event.target.checked)}
            className="mt-1 size-4 accent-accent"
          />
          <span>靠近頭皮操作</span>
        </label>
        <label className="flex items-start gap-3 rounded-md border border-border bg-panel p-3 text-sm">
          <input
            type="checkbox"
            checked={acceptsHighRisk}
            onChange={(event) => onAcceptsHighRiskChange(event.target.checked)}
            className="mt-1 size-4 accent-accent"
          />
          <span>已閱讀高風險提醒</span>
        </label>
      </div>
    </div>
  );
}
