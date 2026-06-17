import {
  AlertTriangle,
  BadgeCheck,
  ClipboardList,
  Droplets,
  FileText,
  Gauge,
} from "lucide-react";
import { RiskBadges } from "@/components/RiskBadges";
import { ResultActions } from "@/components/ResultActions";
import type { ConfidenceLevel, FormulaOutput } from "@/lib/types";

type FormulaResultProps = {
  result: FormulaOutput | null;
};

const confidenceLabels: Record<ConfidenceLevel, string> = {
  high: "信心高",
  medium: "信心中",
  low: "信心低",
};

function formatGrams(grams: number | null) {
  return grams === null ? "需人工確認" : `${grams} g`;
}

function getResultStatus(result: FormulaOutput) {
  const hasPreciseGrams =
    result.totalColorGrams !== null &&
    result.totalDeveloperGrams !== null &&
    result.formulaItems.every((item) => item.grams !== null);

  if (!hasPreciseGrams) {
    return {
      className: "border-red-300 bg-red-50 text-red-900",
      description:
        "目前不輸出精確克數，請先髮束測試並由資深設計師現場判斷。",
      icon: AlertTriangle,
      label: "高風險確認",
    };
  }

  if (result.confidenceLevel === "low" || result.riskWarnings.length >= 3) {
    return {
      className: "border-amber-300 bg-amber-50 text-amber-950",
      description: "可作為配方方向，但建議加強人工確認與髮束測試。",
      icon: AlertTriangle,
      label: "需加強確認",
    };
  }

  return {
    className: "border-emerald-300 bg-emerald-50 text-emerald-900",
    description: "未偵測到阻擋條件，仍需依品牌手冊與現場判斷確認。",
    icon: BadgeCheck,
    label: "可作為配方方向",
  };
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted p-3">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon aria-hidden="true" className="size-3.5" />
        {label}
      </div>
      <p className="mt-2 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function FormulaResult({ result }: FormulaResultProps) {
  if (!result) {
    return (
      <aside className="rounded-lg border border-border bg-panel p-5 shadow-sm lg:sticky lg:top-24">
        <div className="flex items-center gap-2 text-accent">
          <ClipboardList aria-hidden="true" className="size-5" />
          <h2 className="text-lg font-semibold text-foreground">計算結果</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          完成 4 個步驟後送出，這裡會顯示配方狀態、雙氧建議、施工流程、風險提醒與信心等級。
        </p>
        <div className="mt-4 rounded-lg border border-dashed border-border bg-muted p-4 text-sm leading-6 text-muted-foreground">
          專業配方卡會保留安全聲明，並提供下載配方摘要與分享給設計師的操作。
        </div>
      </aside>
    );
  }

  const status = getResultStatus(result);
  const StatusIcon = status.icon;
  const developerValue =
    result.developer.developerPercent === null
      ? "需人工確認"
      : `${result.developer.developerPercent}% / ${result.developer.volume} vol`;

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <section className={`rounded-lg border p-5 shadow-sm ${status.className}`}>
        <div className="flex items-start gap-3">
          <StatusIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal">
              Formula Status
            </p>
            <h2 className="mt-1 text-lg font-semibold">{status.label}</h2>
            <p className="mt-2 text-sm leading-6">{status.description}</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-panel p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">專業配方卡</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              混合比例：{result.mixingRatio}
            </p>
          </div>
          <span className="rounded-md border border-border bg-muted px-3 py-2 text-sm font-semibold">
            {confidenceLabels[result.confidenceLevel]}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <MetricCard
            icon={FileText}
            label="染膏總量"
            value={formatGrams(result.totalColorGrams)}
          />
          <MetricCard
            icon={Droplets}
            label="雙氧總量"
            value={formatGrams(result.totalDeveloperGrams)}
          />
          <MetricCard icon={Gauge} label="雙氧濃度" value={developerValue} />
          <MetricCard
            icon={BadgeCheck}
            label="信心等級"
            value={confidenceLabels[result.confidenceLevel]}
          />
        </div>

        <div className="mt-4 grid gap-3">
          {result.formulaItems.map((item) => (
            <div
              key={`${item.label}-${item.role}`}
              className="rounded-lg border border-border bg-panel p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{item.label}</span>
                <span className="font-mono text-sm font-semibold">
                  {formatGrams(item.grams)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.note}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-950">
          本工具不保證染髮結果；實際操作前應依品牌官方說明做皮膚過敏測試與髮束測試，最終配方需由專業美髮設計師確認。
        </p>

        <div className="mt-4">
          <ResultActions result={result} />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-panel p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Droplets aria-hidden="true" className="size-5 text-accent" />
          <h2 className="text-lg font-semibold">雙氧建議</h2>
        </div>
        <div className="mt-3 rounded-md border border-border bg-muted p-3">
          <p className="font-medium">{developerValue}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {result.developer.reason}
          </p>
        </div>
        {result.developer.restrictions.length > 0 && (
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
            {result.developer.restrictions.map((restriction) => (
              <li key={restriction}>{restriction}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-border bg-panel p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <ClipboardList aria-hidden="true" className="size-5 text-accent" />
          <h2 className="text-lg font-semibold">施工流程</h2>
        </div>
        <ol className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
          {result.processSteps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-lg border border-border bg-panel p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle aria-hidden="true" className="size-5 text-warning" />
          <h2 className="text-lg font-semibold">風險提醒</h2>
        </div>
        <div className="mt-4">
          <RiskBadges
            warnings={result.riskWarnings}
            confidenceLevel={result.confidenceLevel}
          />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-panel p-5 shadow-sm">
        <h2 className="text-lg font-semibold">資料來源</h2>
        <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
          {result.sourceSummary.map((source) => (
            <p key={source.sourceId}>
              {source.url ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-accent underline-offset-4 hover:underline"
                >
                  {source.title}
                </a>
              ) : (
                source.title
              )}
              （{source.sourceType} / {source.verification}）
            </p>
          ))}
          <p className="font-medium text-foreground">
            {result.professionalCheckRequired}
          </p>
        </div>
      </section>
    </aside>
  );
}
