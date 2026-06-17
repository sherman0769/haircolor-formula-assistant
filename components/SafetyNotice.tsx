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
