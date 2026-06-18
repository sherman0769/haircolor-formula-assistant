"use client";

import { useEffect, useState } from "react";
import { UsersRound } from "lucide-react";
import { formatPublicVisitCount } from "@/lib/visit-format";

type VisitCounterResponse = {
  configured: boolean;
  count: number | null;
};

const STORAGE_KEY = "haircolor_homepage_visit_counted_v1";

async function loadVisitCount(countVisit: boolean, signal: AbortSignal) {
  const response = await fetch("/api/visits", {
    method: countVisit ? "POST" : "GET",
    signal,
  });

  if (!response.ok) {
    throw new Error("Unable to load visit count.");
  }

  return (await response.json()) as VisitCounterResponse;
}

export function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function updateVisitCount() {
      try {
        const alreadyCounted =
          window.localStorage.getItem(STORAGE_KEY) === "true";
        const data = await loadVisitCount(!alreadyCounted, controller.signal);

        if (!alreadyCounted && data.configured) {
          window.localStorage.setItem(STORAGE_KEY, "true");
        }

        setConfigured(data.configured);
        setCount(data.count);
      } catch {
        setConfigured(false);
        setCount(null);
      } finally {
        setLoading(false);
      }
    }

    void updateVisitCount();

    return () => controller.abort();
  }, []);

  const displayValue = loading ? "讀取中" : formatPublicVisitCount(count);

  return (
    <div className="rounded-lg border border-border bg-panel p-4 shadow-sm">
      <UsersRound aria-hidden="true" className="mb-4 size-5 text-accent" />
      <h2 className="text-base font-semibold">Beta 累積訪問</h2>
      <p className="mt-2 text-3xl font-semibold tracking-normal text-foreground">
        {displayValue}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {configured
          ? "同一瀏覽器只計一次，不儲存顧客資料、IP 或配方內容。"
          : "需先在 Vercel 連接 Upstash Redis，才會開始公開累計。"}
      </p>
    </div>
  );
}
