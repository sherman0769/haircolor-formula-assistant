type ColorLevelMeterProps = {
  currentLevel: number;
  targetLevel: number;
};

const levelColors = [
  "#171312",
  "#241817",
  "#38201a",
  "#5a3423",
  "#7a4a2d",
  "#98633d",
  "#b77e51",
  "#d6a36c",
  "#e8c08b",
  "#f4ddb5",
];

function getLiftLabel(levelDiff: number) {
  if (levelDiff >= 4) {
    return "高風險提淺";
  }

  if (levelDiff >= 2) {
    return "中度提淺";
  }

  if (levelDiff === 1) {
    return "輕度提淺";
  }

  if (levelDiff === 0) {
    return "同度調整";
  }

  return "加深或降度";
}

function getLiftClass(levelDiff: number) {
  if (levelDiff >= 4) {
    return "border-red-300 bg-red-50 text-red-900";
  }

  if (levelDiff >= 2) {
    return "border-amber-300 bg-amber-50 text-amber-950";
  }

  return "border-emerald-300 bg-emerald-50 text-emerald-900";
}

export function ColorLevelMeter({
  currentLevel,
  targetLevel,
}: ColorLevelMeterProps) {
  const levelDiff = targetLevel - currentLevel;

  return (
    <section className="rounded-lg border border-border bg-muted p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            Level Check
          </p>
          <h3 className="mt-1 text-base font-semibold">
            {currentLevel} 度 → {targetLevel} 度
          </h3>
        </div>
        <span
          className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${getLiftClass(levelDiff)}`}
        >
          {levelDiff > 0 ? `+${levelDiff}` : levelDiff}｜{getLiftLabel(levelDiff)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-10 gap-1" aria-label="色度 1 到 10">
        {levelColors.map((color, index) => {
          const level = index + 1;
          const isCurrent = level === currentLevel;
          const isTarget = level === targetLevel;

          return (
            <div key={level} className="space-y-1">
              <div
                className={`h-8 rounded-md border ${
                  isCurrent || isTarget
                    ? "border-foreground ring-2 ring-accent/40"
                    : "border-white/60"
                }`}
                style={{ backgroundColor: color }}
              />
              <div className="text-center text-[10px] font-semibold text-muted-foreground">
                {level}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md border border-border bg-panel px-3 py-2">
          <span className="text-muted-foreground">目前色度</span>
          <strong className="ml-2 text-foreground">{currentLevel}</strong>
        </div>
        <div className="rounded-md border border-border bg-panel px-3 py-2">
          <span className="text-muted-foreground">目標色度</span>
          <strong className="ml-2 text-foreground">{targetLevel}</strong>
        </div>
      </div>
    </section>
  );
}
