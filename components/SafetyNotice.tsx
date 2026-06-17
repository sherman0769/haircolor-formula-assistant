import { ChevronDown, ShieldCheck } from "lucide-react";

type SafetyNoticeProps = {
  compact?: boolean;
};

const safetyStatements = [
  "本工具僅為美髮設計師配方輔助工具，不保證染髮結果。",
  "實際結果會受髮質、底色、殘留色素、受損程度、操作時間、品牌差異、溫度與現場判斷影響。",
  "實際操作前應依品牌官方說明進行皮膚過敏測試，並建議先做髮束測試。",
  "頭皮敏感、受傷、發炎或過度受損髮況，不建議直接操作。",
  "高風險漂髮、黑染殘留、多次漂染與人工色素殘留，應由資深設計師現場判斷；不建議自行高風險漂髮，非專業人士不應自行進行高風險漂髮。",
  "最終配方需由專業美髮設計師確認，品牌規則以官方最新技術手冊為準。",
];

export function SafetyNotice({ compact = false }: SafetyNoticeProps) {
  if (compact) {
    return (
      <section className="min-w-0 rounded-lg border border-border bg-panel p-3 shadow-sm">
        <details className="group min-w-0 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex min-w-0 cursor-pointer list-none items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-teal-50 text-accent">
                <ShieldCheck aria-hidden="true" className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">
                  專業確認
                </span>
                <span className="block truncate text-xs leading-5 text-muted-foreground">
                  配方僅供設計師輔助參考，最終需現場確認。
                </span>
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
              詳情
              <ChevronDown
                aria-hidden="true"
                className="size-3.5 transition group-open:rotate-180"
              />
            </span>
          </summary>

          <div className="mt-3 border-t border-border pt-3">
            <p className="text-sm leading-6 text-foreground">
              本工具僅為美髮設計師配方輔助工具，不保證染髮結果。
            </p>
            <ul className="mt-2 space-y-2 text-xs leading-5 text-muted-foreground">
              {safetyStatements.slice(1).map((statement) => (
                <li key={statement}>{statement}</li>
              ))}
            </ul>
          </div>
        </details>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950">
      <h2 className="text-base font-semibold">專業確認必須保留</h2>
      <ul
        className={
          compact
            ? "mt-2 space-y-2 text-sm leading-6"
            : "mt-3 space-y-3 text-sm leading-6"
        }
      >
        {safetyStatements.map((statement) => (
          <li key={statement}>{statement}</li>
        ))}
      </ul>
    </section>
  );
}
