import Link from "next/link";
import { MessageSquareText, ShieldCheck } from "lucide-react";
import { APP_RELEASE_LABEL, APP_VERSION } from "@/lib/app-meta";

export function BetaBanner() {
  return (
    <aside className="border-b border-border bg-foreground px-4 py-2 text-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs font-medium sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p className="leading-5">
            {APP_RELEASE_LABEL}｜{APP_VERSION}｜不儲存顧客資料，partial
            品牌只提供方向性建議。
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/beta"
            className="rounded-md border border-white/20 px-2.5 py-1 hover:bg-white/10"
          >
            試用說明
          </Link>
          <Link
            href="/feedback"
            className="inline-flex items-center gap-1 rounded-md bg-accent px-2.5 py-1 text-accent-foreground hover:bg-teal-800"
          >
            <MessageSquareText aria-hidden="true" className="size-3.5" />
            回饋
          </Link>
        </div>
      </div>
    </aside>
  );
}
