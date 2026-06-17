import { SERVICE_TYPE_OPTIONS, getLabel } from "@/lib/constants";
import type { BrandRule, VerificationStatus } from "@/lib/types";

type BrandRuleCardProps = {
  rule: BrandRule;
};

const verifiedClasses: Record<VerificationStatus, string> = {
  verified: "border-emerald-300 bg-emerald-50 text-emerald-900",
  partial: "border-amber-300 bg-amber-50 text-amber-950",
  unverified: "border-red-300 bg-red-50 text-red-900",
};

const verifiedLabels: Record<VerificationStatus, string> = {
  verified: "已驗證",
  partial: "部分驗證",
  unverified: "待驗證",
};

function uniqueRatioLabels(rule: BrandRule) {
  return Array.from(
    new Set(rule.rules.mixingRules.map((mixingRule) => mixingRule.ratioLabel)),
  ).join(" / ");
}

function uniqueDevelopers(rule: BrandRule) {
  return Array.from(
    new Set(
      rule.rules.developerRules.map(
        (developer) => `${developer.developerPercent}% (${developer.volume} vol)`,
      ),
    ),
  ).join("、");
}

function processingRange(rule: BrandRule) {
  const mins = rule.rules.mixingRules.map((mixingRule) => mixingRule.processingTimeMin);
  const maxes = rule.rules.mixingRules.map((mixingRule) => mixingRule.processingTimeMax);

  return `${Math.min(...mins)}-${Math.max(...maxes)} 分鐘`;
}

export function BrandRuleCard({ rule }: BrandRuleCardProps) {
  return (
    <article className="rounded-lg border border-border bg-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{rule.brandName}</p>
          <h2 className="mt-1 text-lg font-semibold">{rule.productLineName}</h2>
        </div>
        <span
          className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${verifiedClasses[rule.verified]}`}
        >
          {verifiedLabels[rule.verified]}
        </span>
      </div>

      <dl className="mt-5 grid gap-3 text-sm">
        <div>
          <dt className="font-medium text-foreground">混合比例</dt>
          <dd className="mt-1 text-muted-foreground">{uniqueRatioLabels(rule)}</dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">可用雙氧</dt>
          <dd className="mt-1 text-muted-foreground">{uniqueDevelopers(rule)}</dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">停留時間</dt>
          <dd className="mt-1 text-muted-foreground">{processingRange(rule)}</dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">適用服務</dt>
          <dd className="mt-1 text-muted-foreground">
            {rule.serviceTypes
              .map((serviceType) => getLabel(SERVICE_TYPE_OPTIONS, serviceType))
              .join("、")}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">限制條件</dt>
          <dd className="mt-1 text-muted-foreground">
            {rule.rules.restrictions.join(" ")}
          </dd>
        </div>
      </dl>
      <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
        {rule.sourceTitle} / {rule.sourceType} / retrieved {rule.retrievedAt}
      </p>
      {rule.verified !== "verified" && (
        <p className="mt-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-950">
          此產品線資料尚未完整 verified，不會假裝為官方精確手冊內容。
        </p>
      )}
    </article>
  );
}
