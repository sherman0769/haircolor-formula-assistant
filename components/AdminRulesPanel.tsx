"use client";

import { useMemo, useSyncExternalStore } from "react";
import { CheckCircle2, LockKeyhole, ShieldAlert, TriangleAlert } from "lucide-react";
import type { VerificationStatus } from "@/lib/types";
import {
  AdminAccessButton,
  ADMIN_ACCESS_EVENT,
  ADMIN_STORAGE_KEY,
} from "@/components/AdminAccessButton";

export type AdminRuleRow = {
  id: string;
  brandName: string;
  productLineName: string;
  verified: VerificationStatus;
  sourceTitle: string;
  sourceType: string;
  retrievedAt: string;
  blockers: string[];
};

type AdminRulesPanelProps = {
  rows: AdminRuleRow[];
};

const statusLabels: Record<VerificationStatus, string> = {
  verified: "已驗證",
  partial: "部分驗證",
  unverified: "待驗證",
};

const statusClasses: Record<VerificationStatus, string> = {
  verified: "border-emerald-300 bg-emerald-50 text-emerald-900",
  partial: "border-amber-300 bg-amber-50 text-amber-950",
  unverified: "border-red-300 bg-red-50 text-red-900",
};

function subscribeToAdminAccess(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(ADMIN_ACCESS_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(ADMIN_ACCESS_EVENT, onStoreChange);
  };
}

function getAdminAccessSnapshot() {
  return window.sessionStorage.getItem(ADMIN_STORAGE_KEY) === "true";
}

function getServerAdminAccessSnapshot() {
  return false;
}

export function AdminRulesPanel({ rows }: AdminRulesPanelProps) {
  const unlocked = useSyncExternalStore(
    subscribeToAdminAccess,
    getAdminAccessSnapshot,
    getServerAdminAccessSnapshot,
  );

  const counts = useMemo(
    () => ({
      verified: rows.filter((row) => row.verified === "verified").length,
      partial: rows.filter((row) => row.verified === "partial").length,
      unverified: rows.filter((row) => row.verified === "unverified").length,
    }),
    [rows],
  );

  if (!unlocked) {
    return (
      <section className="rounded-lg border border-border bg-panel p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <LockKeyhole aria-hidden="true" className="mt-1 size-5 text-accent" />
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-normal">
              規則升級控制端
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              這裡是品牌規則升級與驗證狀態的內部入口。請輸入 MVP 密碼後查看目前待補資料。
            </p>
          </div>
        </div>
        <AdminAccessButton
          buttonLabel="輸入密碼"
          className="mt-5 max-w-md"
        />
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-panel p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-accent">內部檢視</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">
              規則升級控制端
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              目前僅提供只讀檢視與升級判斷方向。正式版本應在後台加入登入、角色權限、資料審核與版本紀錄。
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <StatusMetric label="已驗證" value={counts.verified} />
            <StatusMetric label="部分" value={counts.partial} />
            <StatusMetric label="待驗證" value={counts.unverified} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-warning/40 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <div className="flex gap-2">
          <ShieldAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>
            升級 verified 前，必須確認官方技術手冊或品牌正式資料，並補齊混合比例、雙氧限制、停留時間、白髮覆蓋與安全限制。比例為範圍或依技術變動者，仍應維持 partial，避免輸出精確克數。
          </p>
        </div>
      </section>

      <section className="grid gap-4">
        {rows.map((row) => (
          <article
            key={row.id}
            className="rounded-lg border border-border bg-panel p-5 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{row.brandName}</p>
                <h2 className="mt-1 text-lg font-semibold">
                  {row.productLineName}
                </h2>
              </div>
              <span
                className={`w-fit rounded-md border px-2.5 py-1 text-xs font-semibold ${statusClasses[row.verified]}`}
              >
                {statusLabels[row.verified]}
              </span>
            </div>

            <dl className="mt-4 grid gap-3 text-sm md:grid-cols-3">
              <div>
                <dt className="font-medium text-foreground">來源</dt>
                <dd className="mt-1 text-muted-foreground">{row.sourceTitle}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">來源類型</dt>
                <dd className="mt-1 text-muted-foreground">{row.sourceType}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">擷取日期</dt>
                <dd className="mt-1 text-muted-foreground">{row.retrievedAt}</dd>
              </div>
            </dl>

            <div className="mt-4 rounded-md border border-border bg-muted/50 p-3">
              <p className="flex items-center gap-2 text-sm font-semibold">
                {row.verified === "verified" ? (
                  <CheckCircle2
                    aria-hidden="true"
                    className="size-4 text-emerald-700"
                  />
                ) : (
                  <TriangleAlert
                    aria-hidden="true"
                    className="size-4 text-warning"
                  />
                )}
                升級檢查
              </p>
              <ul className="mt-2 space-y-1 text-sm leading-6 text-muted-foreground">
                {row.blockers.map((blocker) => (
                  <li key={blocker}>{blocker}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function StatusMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-muted px-3 py-2">
      <p className="text-xl font-semibold">{value}</p>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
