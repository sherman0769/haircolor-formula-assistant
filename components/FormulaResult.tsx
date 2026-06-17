import { RiskBadges } from "@/components/RiskBadges";
import { ResultActions } from "@/components/ResultActions";
import type { FormulaOutput } from "@/lib/types";

type FormulaResultProps = {
  result: FormulaOutput | null;
};

function formatGrams(grams: number | null) {
  return grams === null ? "需人工確認" : `${grams} g`;
}

export function FormulaResult({ result }: FormulaResultProps) {
  if (!result) {
    return (
      <aside className="rounded-lg border border-border bg-panel p-5">
        <h2 className="text-lg font-semibold">計算結果</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          完成輸入後送出，結果會顯示建議配方、雙氧、施工流程、風險提醒與信心等級。
        </p>
      </aside>
    );
  }

  return (
    <aside className="space-y-4">
      <section className="rounded-lg border border-border bg-panel p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">建議配方</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              混合比例：{result.mixingRatio}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              本工具不保證染髮結果；實際操作前應依品牌官方說明做皮膚過敏測試與髮束測試，最終配方需由專業美髮設計師確認。
            </p>
          </div>
          <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm">
            染膏 {formatGrams(result.totalColorGrams)} / 雙氧{" "}
            {formatGrams(result.totalDeveloperGrams)}
          </div>
        </div>
        <div className="mt-4 divide-y divide-border">
          {result.formulaItems.map((item) => (
            <div key={`${item.label}-${item.role}`} className="py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{item.label}</span>
                <span className="font-mono text-sm">{formatGrams(item.grams)}</span>
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {item.note}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <ResultActions result={result} />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-panel p-5">
        <h2 className="text-lg font-semibold">雙氧建議</h2>
        <div className="mt-3 rounded-md border border-border bg-muted p-3">
          <p className="font-medium">
            {result.developer.developerPercent === null
              ? "需人工確認"
              : `${result.developer.developerPercent}% / ${result.developer.volume} vol`}
          </p>
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

      <section className="rounded-lg border border-border bg-panel p-5">
        <h2 className="text-lg font-semibold">施工流程</h2>
        <ol className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
          {result.processSteps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="font-mono text-xs text-accent">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-lg border border-border bg-panel p-5">
        <h2 className="text-lg font-semibold">風險提醒</h2>
        <div className="mt-4">
          <RiskBadges
            warnings={result.riskWarnings}
            confidenceLevel={result.confidenceLevel}
          />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-panel p-5">
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
