import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList, LockKeyhole, Megaphone } from "lucide-react";
import {
  APP_RELEASE_LABEL,
  APP_VERSION,
  betaTrialHighlights,
  betaTrialLimits,
  launchMessage,
} from "@/lib/app-meta";

export const metadata: Metadata = {
  title: "免費 Beta 試用說明",
  description: "HairColor Formula Assistant 免費 Beta 試用版說明、限制與發佈文案。",
};

export default function BetaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-accent">{APP_RELEASE_LABEL}</p>
        <h1 className="text-3xl font-semibold tracking-normal">
          設計師免費試用說明
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          目前版本為 {APP_VERSION}，適合開放給設計師小規模到數百人免費試用，重點是收集操作體驗、品牌資料缺口與風險提醒是否清楚。
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-border bg-panel p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <ClipboardList aria-hidden="true" className="size-5 text-accent" />
            <h2 className="text-lg font-semibold">試用版已具備</h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            {betaTrialHighlights.map((item) => (
              <li key={item} className="border-b border-border pb-3 last:border-0">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-panel p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <LockKeyhole aria-hidden="true" className="size-5 text-accent" />
            <h2 className="text-lg font-semibold">目前限制</h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            {betaTrialLimits.map((item) => (
              <li key={item} className="border-b border-border pb-3 last:border-0">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-border bg-panel p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Megaphone aria-hidden="true" className="size-5 text-accent" />
              <h2 className="text-lg font-semibold">可轉貼公告文案</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              發給設計師群組前，可依實際對象微調文字。
            </p>
          </div>
          <Link
            href="/feedback"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-teal-800"
          >
            前往回饋頁
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <pre className="mt-5 overflow-x-auto rounded-md border border-border bg-muted p-4 text-sm leading-7 text-foreground whitespace-pre-wrap">
          {launchMessage}
        </pre>
      </section>
    </div>
  );
}
