"use client";

import { useState } from "react";
import { Clipboard, CheckCircle2 } from "lucide-react";
import { feedbackTemplate } from "@/lib/app-meta";

export function FeedbackTemplateCard() {
  const [copied, setCopied] = useState(false);

  async function copyTemplate() {
    await navigator.clipboard.writeText(feedbackTemplate);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <section className="rounded-lg border border-border bg-panel p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-accent">回饋格式</p>
          <h2 className="mt-2 text-xl font-semibold">複製後貼到 LINE 或私訊</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            免費試用初期先用人工方式收集問題，避免使用者資料進入未確認的第三方流程。
          </p>
        </div>
        <button
          type="button"
          onClick={copyTemplate}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-teal-800"
        >
          {copied ? (
            <CheckCircle2 aria-hidden="true" className="size-4" />
          ) : (
            <Clipboard aria-hidden="true" className="size-4" />
          )}
          {copied ? "已複製" : "複製回饋格式"}
        </button>
      </div>
      <pre className="mt-5 overflow-x-auto rounded-md border border-border bg-muted p-4 text-sm leading-7 text-foreground whitespace-pre-wrap">
        {feedbackTemplate}
      </pre>
    </section>
  );
}
