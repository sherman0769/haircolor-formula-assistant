import type { Metadata } from "next";
import { AdminRulesPanel } from "@/components/AdminRulesPanel";
import { getBrandRules } from "@/lib/brand-rules";
import { buildRuleAuditRows } from "@/lib/rule-audit";

export const metadata: Metadata = {
  title: "規則控制端",
};

export default function AdminRulesPage() {
  const rows = buildRuleAuditRows(getBrandRules());

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <AdminRulesPanel rows={rows} />
    </div>
  );
}
