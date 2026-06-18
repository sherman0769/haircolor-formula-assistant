import { getBrandRule, getSourcesByIds } from "@/lib/brand-rules";
import {
  PROFESSIONAL_CHECK_REQUIRED,
  estimateTotalColorGrams,
} from "@/lib/constants";
import { buildNeutralizationAdvice } from "@/lib/color-theory";
import { assessFormulaRisk } from "@/lib/risk-engine";
import type {
  BrandRule,
  ConfidenceLevel,
  FormulaDeveloper,
  FormulaInput,
  FormulaItem,
  MixingRule,
} from "@/lib/types";
import {
  getRequestedTotalColorGrams,
  validateFormulaInput,
} from "@/lib/validators";

function roundGram(value: number) {
  return Math.round(value * 10) / 10;
}

function getFallbackBrandRule() {
  const fallback = getBrandRule("generic", "generic-permanent-rules");

  if (!fallback) {
    throw new Error("Missing generic brand rule seed data.");
  }

  return fallback;
}

function selectMixingRule(brandRule: BrandRule, input: FormulaInput) {
  const exact = brandRule.rules.mixingRules.find(
    (rule) => rule.serviceType === input.serviceType,
  );

  if (exact) {
    return exact;
  }

  const compatible = brandRule.rules.mixingRules.find((rule) =>
    brandRule.serviceTypes.includes(rule.serviceType),
  );

  return compatible ?? brandRule.rules.mixingRules[0];
}

function nearestAllowedDeveloper(
  desiredPercent: number,
  allowedDevelopers: number[],
  maxPercent: number,
) {
  const capped = allowedDevelopers
    .filter((developer) => developer <= maxPercent)
    .sort((a, b) => Math.abs(a - desiredPercent) - Math.abs(b - desiredPercent));

  return capped[0] ?? Math.min(...allowedDevelopers);
}

function getDeveloperReason(input: FormulaInput, levelDiff: number) {
  if (input.serviceType === "grey-coverage" || input.needsGreyCoverage) {
    return "白髮覆蓋需要穩定覆蓋力，優先選擇品牌允許且較常用於覆蓋的雙氧。";
  }

  if (input.serviceType === "bleach") {
    return "漂髮依提淺需求與頭皮距離選擇雙氧，並需目視檢查進展。";
  }

  if (input.serviceType === "high-lift") {
    return "高明度染需依品牌允許範圍選擇較高提淺力雙氧。";
  }

  if (input.serviceType === "post-fade-toning" || input.needsToning) {
    return "退色後補色或霧感調整以補色、上色為主，避免不必要提淺。";
  }

  if (levelDiff <= 0) {
    return "只上色或同度調整，使用較低提淺力雙氧。";
  }

  if (levelDiff <= 2) {
    return "目標約提淺 1-2 度。";
  }

  if (levelDiff <= 3) {
    return "目標約提淺 2-3 度。";
  }

  return "目標提淺幅度高，需評估是否改用漂髮或分段操作。";
}

function recommendDeveloper(
  input: FormulaInput,
  brandRule: BrandRule,
  mixingRule: MixingRule,
  levelDiff: number,
): FormulaDeveloper {
  const allowedDevelopers =
    mixingRule.allowedDevelopers.length > 0
      ? mixingRule.allowedDevelopers
      : brandRule.rules.developerRules.map((rule) => rule.developerPercent);

  let desiredPercent = 3;
  let maxPercent = Math.max(...allowedDevelopers);

  if (input.serviceType === "bleach") {
    desiredPercent = levelDiff >= 4 ? 9 : 6;
  } else if (input.serviceType === "high-lift") {
    desiredPercent = levelDiff >= 3 ? 12 : 9;
  } else if (input.serviceType === "grey-coverage" || input.needsGreyCoverage) {
    desiredPercent = levelDiff > 2 ? 9 : 6;
  } else if (input.serviceType === "post-fade-toning" || input.needsToning) {
    desiredPercent = 3;
  } else if (levelDiff <= 0) {
    desiredPercent = 3;
  } else if (levelDiff <= 2) {
    desiredPercent = 6;
  } else if (levelDiff <= 3) {
    desiredPercent = 9;
  } else {
    desiredPercent = 12;
  }

  if (input.damageLevel === "high") {
    maxPercent = Math.min(maxPercent, 6);
  }

  if (input.damageLevel === "extreme") {
    maxPercent = Math.min(maxPercent, 3);
  }

  if (input.nearScalp && (input.serviceType === "bleach" || input.serviceType === "high-lift")) {
    maxPercent = Math.min(maxPercent, 6);
  }

  const developerPercent = nearestAllowedDeveloper(
    desiredPercent,
    allowedDevelopers,
    maxPercent,
  );
  const developerRule = brandRule.rules.developerRules.find(
    (rule) => rule.developerPercent === developerPercent,
  );

  return {
    developerPercent,
    volume: developerRule?.volume ?? developerPercentToVolume(developerPercent),
    reason: getDeveloperReason(input, levelDiff),
    restrictions: developerRule?.restrictions ?? [],
  };
}

function developerPercentToVolume(percent: number) {
  if (percent === 1.9) {
    return 6;
  }

  if (percent === 3.75) {
    return 12.5;
  }

  return Math.round((percent / 3) * 10);
}

function getGreyBasePercent(input: FormulaInput, brandRule: BrandRule) {
  const rule = brandRule.rules.greyCoverageRules?.find(
    (coverageRule) => coverageRule.greyPercentage === input.greyPercentage,
  );

  if (rule) {
    return rule.baseShadePercent;
  }

  switch (input.greyPercentage) {
    case "1-25":
      return 25;
    case "26-50":
      return 35;
    case "51-75":
      return 50;
    case "76-100":
      return 60;
    default:
      return input.needsGreyCoverage ? 35 : 0;
  }
}

function buildFormulaItems(
  input: FormulaInput,
  brandRule: BrandRule,
  totalColorGrams: number,
): FormulaItem[] {
  const items: FormulaItem[] = [];
  const isLightener = input.serviceType === "bleach";
  const neutralizationAdvice = buildNeutralizationAdvice(
    input.observedUndertone,
    input.targetTone,
  );
  const needsGreyBase = input.needsGreyCoverage || input.greyPercentage !== "0";
  const basePercent = needsGreyBase ? getGreyBasePercent(input, brandRule) : 0;
  const baseGrams = roundGram((totalColorGrams * basePercent) / 100);
  const mainGrams = roundGram(totalColorGrams - baseGrams);

  if (isLightener) {
    items.push({
      label: "漂粉／漂膏",
      grams: totalColorGrams,
      role: "lightener",
      note: "依產品線規則混合；靠近頭皮與高受損髮需降低風險並目視檢查。",
    });
  } else {
    items.push({
      label: "主色",
      grams: mainGrams,
      role: "main",
      note: "目標色系主配方，需由設計師依實際色號對應。",
    });
  }

  if (baseGrams > 0) {
    items.push({
      label: "自然基底色",
      grams: baseGrams,
      role: "base",
      note: `依白髮比例加入約 ${basePercent}% 自然基底色；抗拒白髮仍需依品牌教育系統調整。`,
    });
  }

  if (neutralizationAdvice || input.needsToning) {
    items.push({
      label: neutralizationAdvice
        ? `${neutralizationAdvice.correctiveTone}色系補色／調彩`
        : "補色／調彩",
      grams: null,
      role: "additive",
      note:
        neutralizationAdvice?.advice ??
        "若需要補色或中和，請依品牌調彩濃度、目標色與現場底色決定，不使用通用公式硬算克數。",
    });
  }

  return items;
}

function buildReferenceFormulaItems(input: FormulaInput, reason: string) {
  const neutralizationAdvice = buildNeutralizationAdvice(
    input.observedUndertone,
    input.targetTone,
  );
  const items: FormulaItem[] = [
    {
      label: "通用參考方向",
      grams: null,
      role: "reference",
      note: reason,
    },
  ];

  if (neutralizationAdvice) {
    items.push({
      label: `${neutralizationAdvice.correctiveTone}色系方向`,
      grams: null,
      role: "additive",
      note: neutralizationAdvice.advice,
    });
  }

  return items;
}

function buildProcessSteps(
  input: FormulaInput,
  mixingRule: MixingRule,
  brandRule: BrandRule,
) {
  const steps = [
    "人工確認目前底色、髮束彈性、白髮分布與人工色素殘留，再決定是否沿用建議方向。",
    "先做髮束測試；色卡照片與頭髮照片只能作為參考，不能取代現場判斷。",
    "以乾髮分區操作，確保塗佈量一致並避免金屬器具干擾產品規則。",
  ];

  if (input.serviceType === "bleach") {
    steps.push("漂髮採小分區塗抹，避免堆疊過厚，必要時分段處理深淺不均區域。");
    steps.push("每 5-10 分鐘目視檢查提淺進度與髮況反應。");
  } else if (input.serviceType === "retouch") {
    steps.push("補染以新生髮或需要修補區域優先，避免重複堆疊在已染受損髮段。");
  } else if (input.targetLevel > input.currentLevel && !input.nearScalp) {
    steps.push("需要提淺時可先處理髮中髮尾，再依頭皮熱度與目標色補上髮根。");
  } else {
    steps.push("同度或補色操作以均勻塗佈為主，避免在多孔受損髮段過度沉澱。");
  }

  if (input.needsGreyCoverage || input.greyPercentage !== "0") {
    steps.push("白髮覆蓋可優先塗佈白髮集中或抗拒區，並確認自然基底色比例。");
  }

  if (mixingRule.processingTimeMin <= 0 || mixingRule.processingTimeMax <= 0) {
    steps.push(
      `停留時間需依 ${brandRule.productLineName} 官方技術手冊確認；目前資料不足，不建議依系統時間操作。`,
    );
  } else {
    steps.push(
      `建議停留時間範圍：${mixingRule.processingTimeMin}-${mixingRule.processingTimeMax} 分鐘；仍需以 ${brandRule.productLineName} 官方技術資料與現場髮況為準。`,
    );
  }
  steps.push("沖洗前乳化並完整清潔，後續照護依品牌與沙龍流程執行。");

  return steps;
}

function resolveConfidence(
  brandRule: BrandRule,
  riskScore: number,
  preciseAllowed: boolean,
  input: FormulaInput,
): ConfidenceLevel {
  if (!preciseAllowed || brandRule.verified !== "verified" || riskScore >= 6) {
    return "low";
  }

  if (
    riskScore >= 3 ||
    input.hasBoxDyeOrBlackDye !== "no" ||
    input.artificialPigmentResidue.length > 0 ||
    input.damageLevel === "medium"
  ) {
    return "medium";
  }

  return "high";
}

export function calculateFormula(input: FormulaInput) {
  const validationErrors = validateFormulaInput(input);
  const brandRule =
    getBrandRule(input.brandId, input.productLineId) ?? getFallbackBrandRule();
  const mixingRule = selectMixingRule(brandRule, input);
  const levelDiff = input.targetLevel - input.currentLevel;
  const developer = recommendDeveloper(input, brandRule, mixingRule, levelDiff);
  const riskAssessment = assessFormulaRisk(
    input,
    brandRule,
    developer.developerPercent,
  );
  const exactFormulaReason =
    validationErrors.length > 0
      ? validationErrors.join(" ")
      : "品牌規則未完整 verified、風險過高或目前底色尚未人工確認，因此只提供方向性建議。";
  const preciseAllowed =
    validationErrors.length === 0 &&
    brandRule.verified === "verified" &&
    input.manualBaseConfirmed &&
    !riskAssessment.blocksPreciseFormula;
  const requestedTotalColorGrams = getRequestedTotalColorGrams(input);
  const totalColorGrams = preciseAllowed ? requestedTotalColorGrams : null;
  const totalDeveloperGrams = preciseAllowed
    ? roundGram(requestedTotalColorGrams * mixingRule.ratio)
    : null;
  const formulaItems = preciseAllowed
    ? buildFormulaItems(input, brandRule, requestedTotalColorGrams)
    : buildReferenceFormulaItems(input, exactFormulaReason);
  const sourceSummary = getSourcesByIds(brandRule.sourceIds).map((source) => ({
    sourceId: source.id,
    title: source.title,
    sourceType: source.sourceType,
    verification: source.verification,
    url: source.url,
  }));
  const riskWarnings = Array.from(
    new Set([
      ...validationErrors,
      ...brandRule.rules.restrictions,
      ...brandRule.rules.warnings,
      ...mixingRule.warnings,
      ...riskAssessment.warnings,
    ]),
  );
  const confidenceLevel = resolveConfidence(
    brandRule,
    riskAssessment.riskScore,
    preciseAllowed,
    input,
  );

  return {
    formulaItems,
    developer,
    totalColorGrams,
    totalDeveloperGrams,
    mixingRatio: mixingRule.ratioLabel,
    processSteps: buildProcessSteps(input, mixingRule, brandRule),
    riskWarnings,
    confidenceLevel,
    sourceSummary,
    professionalCheckRequired: PROFESSIONAL_CHECK_REQUIRED,
  };
}

export function getEstimatedColorGrams(input: FormulaInput) {
  return estimateTotalColorGrams(input.hairLength, input.hairDensity);
}
