import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageSquareText, ShieldCheck } from "lucide-react";
import { FeedbackTemplateCard } from "@/components/FeedbackTemplateCard";

export const metadata: Metadata = {
  title: "Beta 回饋",
  description: "HairColor Formula Assistant 免費 Beta 試用回饋入口。",
};

export default function FeedbackPage() {
  return (
    <div className="mx-auto min-w-0 max-w-5xl overflow-x-clip px-4 py-8 sm:py-10">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-accent">Beta 回饋入口</p>
        <h1 className="text-3xl font-semibold tracking-normal">
          回報問題與試用建議
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          目前 Beta 版本使用 Google 表單收集試用回饋，協助補齊品牌規則、手機體驗與操作問題。請勿填寫顧客姓名、電話、地址或可識別個資。
        </p>
      </div>

      <div className="mt-8 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <FeedbackTemplateCard />
        <aside className="min-w-0 space-y-4">
          <section className="min-w-0 rounded-lg border border-border bg-panel p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck aria-hidden="true" className="size-5 text-accent" />
              <h2 className="text-lg font-semibold">回饋前提醒</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>不要傳送顧客姓名、電話、地址或完整臉部照片。</li>
              <li>目前表單不收檔案上傳；若提供截圖連結，請先遮蔽可識別資訊。</li>
              <li>請註明品牌、產品線、目前髮色與目標色，方便判斷問題。</li>
              <li>若是安全或風險疑慮，請先停止操作並由資深設計師現場判斷。</li>
            </ul>
          </section>
          <Link
            href="/beta"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-panel px-4 py-3 text-sm font-semibold hover:border-accent"
          >
            <MessageSquareText aria-hidden="true" className="size-4" />
            查看試用說明
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
