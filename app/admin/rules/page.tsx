import type { Metadata } from "next";
import { AdminRulesPanel, type AdminRuleRow } from "@/components/AdminRulesPanel";
import { getBrandRules } from "@/lib/brand-rules";
import type { BrandRule } from "@/lib/types";

export const metadata: Metadata = {
  title: "規則控制端",
};

function hasFlexibleRatio(rule: BrandRule) {
  return rule.rules.mixingRules.some((mixingRule) =>
    /-|–|~|to|up to/i.test(mixingRule.ratioLabel),
  );
}

function getBlockers(rule: BrandRule) {
  if (rule.verified === "verified") {
    return ["目前可作為已驗證規則使用；後續仍需定期比對官方最新技術手冊。"];
  }

  const blockers = [
    "需要補齊或再次比對品牌官方技術手冊，確認來源為最新版本。",
  ];

  if (rule.verified === "unverified") {
    blockers.push("目前為資料結構或方向性占位，不可輸出精確克數。");
  }

  if (rule.verified === "partial") {
    blockers.push("目前只完成部分驗證，仍不可視為完整官方規則。");
  }

  if (hasFlexibleRatio(rule)) {
    blockers.push("混合比例含範圍或依技術調整，需先升級資料結構才可精準計算。");
  }

  if (!rule.rules.greyCoverageRules?.length) {
    blockers.push("白髮覆蓋比例尚未完整建模，白髮服務需維持人工確認。");
  }

  return blockers;
}

export default function AdminRulesPage() {
  const rows: AdminRuleRow[] = getBrandRules().map((rule) => ({
    id: rule.productLineId,
    brandName: rule.brandName,
    productLineName: rule.productLineName,
    verified: rule.verified,
    sourceTitle: rule.sourceTitle,
    sourceType: rule.sourceType,
    retrievedAt: rule.retrievedAt,
    blockers: getBlockers(rule),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <AdminRulesPanel rows={rows} />
    </div>
  );
}
