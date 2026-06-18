import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { HomeVisitTracker } from "@/components/HomeVisitTracker";
import { SafetyNotice } from "@/components/SafetyNotice";
import { VisitCounter } from "@/components/VisitCounter";
import { APP_VERSION } from "@/lib/app-meta";

const entryLinks = [
  {
    href: "/formula",
    title: "開始計算配方",
    description: "輸入髮況、目標色與操作條件，取得規則引擎建議。",
    icon: Calculator,
  },
  {
    href: "/brands",
    title: "查看品牌規則",
    description: "檢視內建產品線的混合比例、雙氧與資料來源狀態。",
    icon: BookOpen,
  },
  {
    href: "/about",
    title: "使用說明與安全提醒",
    description: "確認工具定位、資料限制與人工判斷流程。",
    icon: ShieldCheck,
  },
  {
    href: "/feedback",
    title: "Beta 試用回饋",
    description: "複製回饋格式，回報操作問題、品牌資料缺口與手機體驗。",
    icon: MessageSquareText,
  },
];

export default function HomePage() {
  return (
    <>
      <HomeVisitTracker />
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/salon-color-workspace.svg"
            alt="現代沙龍染髮色彩工作台"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,24,23,0.88),rgba(20,24,23,0.60),rgba(20,24,23,0.18))]" />
        </div>
        <div className="mx-auto flex min-h-[68svh] max-w-6xl items-center px-4 py-12">
          <div className="max-w-2xl space-y-6 text-background">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-semibold backdrop-blur">
              <Sparkles aria-hidden="true" className="size-4" />
              免費 Beta 試用｜{APP_VERSION}
            </p>
            <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">
              HairColor Formula Assistant
            </h1>
            <p className="max-w-xl text-base leading-8 text-white/85 sm:text-lg">
              美髮染髮配方助理。把髮況、目標色與品牌規則整理成可判讀的配方方向、雙氧建議與風險提醒。
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/formula"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-lg shadow-black/20 hover:bg-teal-800"
              >
                開始計算
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href="/beta"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/30 bg-white/10 px-5 text-sm font-semibold text-background backdrop-blur hover:bg-white/20"
              >
                試用說明
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <section className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="grid gap-3 sm:grid-cols-2">
            {entryLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border border-border bg-panel p-4 shadow-sm transition hover:border-accent hover:shadow-md"
                >
                  <Icon aria-hidden="true" className="mb-4 size-5 text-accent" />
                  <h2 className="text-base font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              );
            })}
            <VisitCounter />
          </div>
          <SafetyNotice compact />
        </section>
      </div>
    </>
  );
}
