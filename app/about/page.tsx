import { SafetyNotice } from "@/components/SafetyNotice";

const principles = [
  "公式與比例由本地規則引擎計算，不由 LLM 自由編配方。",
  "品牌資料保留來源欄位；未驗證資料只輸出方向性建議。",
  "色卡照片與頭髮照片只能作為參考，不能取代人工確認目前底色。",
  "本工具不保證染髮結果，實際結果會受髮質、底色、殘留色素、受損程度、操作時間、品牌差異、溫度與現場判斷影響。",
  "實際操作前應依品牌官方說明進行皮膚過敏測試，並建議先做髮束測試。",
  "頭皮敏感、受傷、發炎或過度受損髮況，不建議直接操作。",
  "高受損、黑染殘留、多次漂髮與人工色素殘留會降低信心等級。",
  "高風險漂髮、黑染殘留、多次漂染與人工色素殘留，應由資深設計師現場判斷；不建議自行高風險漂髮，非專業人士不應自行進行高風險漂髮。",
  "所有結果都需要由專業美髮設計師依現場髮況確認，品牌規則以官方最新技術手冊為準。",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-accent">使用說明與安全提醒</p>
        <h1 className="text-3xl font-semibold tracking-normal">
          工具定位與資料限制
        </h1>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SafetyNotice />
        <section className="rounded-lg border border-border bg-panel p-5">
          <h2 className="text-lg font-semibold">第一版原則</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            {principles.map((item) => (
              <li key={item} className="border-b border-border pb-3 last:border-0">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
