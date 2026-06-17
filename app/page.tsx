import Link from "next/link";
import { SafetyNotice } from "@/components/SafetyNotice";

const entryLinks = [
  {
    href: "/formula",
    title: "開始計算配方",
    description: "輸入髮況、目標色與操作條件，取得規則引擎建議。",
  },
  {
    href: "/brands",
    title: "查看品牌規則",
    description: "檢視內建產品線的混合比例、雙氧與資料來源狀態。",
  },
  {
    href: "/about",
    title: "使用說明與安全提醒",
    description: "確認工具定位、資料限制與人工判斷流程。",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-accent">
              美髮設計師配方輔助工具
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
              染髮配方計算器
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              給美髮設計師使用的配方輔助工具。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {entryLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-border bg-panel p-4 transition hover:border-accent hover:shadow-sm"
              >
                <h2 className="text-base font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
        <SafetyNotice compact />
      </section>
    </div>
  );
}
