import type { BrandRule, VerificationStatus } from "@/lib/types";

export type RuleAuditRow = {
  id: string;
  brandName: string;
  productLineName: string;
  verified: VerificationStatus;
  sourceTitle: string;
  sourceType: string;
  retrievedAt: string;
  serviceCount: number;
  sourceCount: number;
  blockers: string[];
  missingItems: string[];
  nextAction: string;
};

function hasFlexibleRatio(rule: BrandRule) {
  return rule.rules.mixingRules.some((mixingRule) =>
    /-|–|~|to|up to|range|requires official manual|brand-dependent/i.test(
      mixingRule.ratioLabel,
    ),
  );
}

function hasOfficialSourceSignal(rule: BrandRule) {
  const sourceText = rule.sourceType.toLowerCase();

  return /official|brand_campaign_page/.test(sourceText);
}

function hasManualSignal(rule: BrandRule) {
  const sourceText = [rule.sourceType, rule.sourceTitle, rule.sourceNote]
    .join(" ")
    .toLowerCase();

  return /manual|technical|技術手冊|official_pdf|course|education/.test(
    sourceText,
  );
}

function getMissingItems(rule: BrandRule) {
  const missingItems: string[] = [];

  if (!hasOfficialSourceSignal(rule)) {
    missingItems.push("官方來源或品牌正式資料");
  }

  if (!hasManualSignal(rule)) {
    missingItems.push("官方技術手冊或完整教育資料");
  }

  if (hasFlexibleRatio(rule)) {
    missingItems.push("可精準建模的混合比例");
  }

  if (rule.rules.developerRules.length === 0) {
    missingItems.push("雙氧濃度與使用限制");
  }

  if (
    rule.rules.mixingRules.some(
      (mixingRule) =>
        mixingRule.processingTimeMin <= 0 || mixingRule.processingTimeMax <= 0,
    )
  ) {
    missingItems.push("停留時間");
  }

  if (!rule.rules.greyCoverageRules?.length) {
    missingItems.push("白髮覆蓋或灰髮霧化規則");
  }

  if (rule.rules.restrictions.length === 0 || rule.rules.warnings.length === 0) {
    missingItems.push("安全限制與警示文字");
  }

  if (rule.verified !== "verified") {
    missingItems.push("升級測試案例與人工審核紀錄");
  }

  return Array.from(new Set(missingItems));
}

function getBlockers(rule: BrandRule, missingItems: string[]) {
  if (rule.verified === "verified" && missingItems.length === 0) {
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

  if (missingItems.length > 0) {
    blockers.push(`待補資料：${missingItems.join("、")}。`);
  }

  return blockers;
}

function getNextAction(rule: BrandRule, missingItems: string[]) {
  if (rule.verified === "verified" && missingItems.length === 0) {
    return "排定定期複核官方最新手冊。";
  }

  if (missingItems.includes("官方技術手冊或完整教育資料")) {
    return "先取得官方技術手冊、課程截圖或品牌正式 PDF，再判斷是否可升級。";
  }

  if (missingItems.includes("可精準建模的混合比例")) {
    return "補齊混合比例的單一比例或建立技術情境欄位，避免用範圍值硬算。";
  }

  if (missingItems.includes("白髮覆蓋或灰髮霧化規則")) {
    return "補齊白髮比例、自然基底色、抗拒白髮與灰髮霧化處理規則。";
  }

  return "補測試案例與人工審核紀錄後，再評估升級狀態。";
}

export function auditBrandRule(rule: BrandRule): RuleAuditRow {
  const missingItems = getMissingItems(rule);

  return {
    id: rule.productLineId,
    brandName: rule.brandName,
    productLineName: rule.productLineName,
    verified: rule.verified,
    sourceTitle: rule.sourceTitle,
    sourceType: rule.sourceType,
    retrievedAt: rule.retrievedAt,
    serviceCount: rule.serviceTypes.length,
    sourceCount: rule.sourceIds.length,
    blockers: getBlockers(rule, missingItems),
    missingItems,
    nextAction: getNextAction(rule, missingItems),
  };
}

export function buildRuleAuditRows(rules: BrandRule[]) {
  return rules.map((rule) => auditBrandRule(rule));
}
