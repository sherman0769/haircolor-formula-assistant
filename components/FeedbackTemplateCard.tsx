"use client";

import { useState } from "react";
import { CheckCircle2, Clipboard, ExternalLink } from "lucide-react";
import { FEEDBACK_FORM_URL, feedbackTemplate } from "@/lib/app-meta";

export function FeedbackTemplateCard() {
  const [copied, setCopied] = useState(false);

  async function copyTemplate() {
    await navigator.clipboard.writeText(feedbackTemplate);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <section className="min-w-0 rounded-lg border border-border bg-panel p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-accent">正式回饋表單</p>
          <h2 className="mt-2 text-xl font-semibold">填寫 Beta 試用回饋</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            表單不使用檔案上傳題，請不要填寫顧客姓名、電話、地址或可識別個資。
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:items-end">
          <a
            href={FEEDBACK_FORM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-teal-800 sm:w-auto"
          >
            <ExternalLink aria-hidden="true" className="size-4" />
            開啟表單
          </a>
          <button
            type="button"
            onClick={copyTemplate}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-panel px-4 text-sm font-semibold hover:border-accent sm:w-auto"
          >
            {copied ? (
              <CheckCircle2 aria-hidden="true" className="size-4" />
            ) : (
              <Clipboard aria-hidden="true" className="size-4" />
            )}
            {copied ? "已複製" : "複製備用格式"}
          </button>
        </div>
      </div>
      <p className="mt-5 rounded-md border border-border bg-muted px-4 py-3 text-sm leading-6 text-muted-foreground">
        如果 Google 表單暫時無法開啟，可先複製下方格式回傳給管理者。
      </p>
      <pre className="mt-5 block max-w-full overflow-x-hidden rounded-md border border-border bg-muted p-4 text-sm leading-7 text-foreground whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
        {feedbackTemplate}
      </pre>
    </section>
  );
}
