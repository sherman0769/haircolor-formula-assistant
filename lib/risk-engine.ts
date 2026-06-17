import type { BrandRule, FormulaInput } from "@/lib/types";

export type RiskAssessment = {
  warnings: string[];
  riskScore: number;
  blocksPreciseFormula: boolean;
};

function isBleachLikeService(serviceType: FormulaInput["serviceType"]) {
  return serviceType === "bleach" || serviceType === "high-lift";
}

function isRepeatedBleachCount(bleachCount: FormulaInput["bleachCount"]) {
  return bleachCount === "2" || bleachCount === "3+";
}

function hasHighRiskArtificialPigment(input: FormulaInput) {
  return input.artificialPigmentResidue.some((pigment) =>
    ["blue", "green", "red", "violet", "purple"].includes(pigment),
  );
}

export function assessFormulaRisk(
  input: FormulaInput,
  brandRule: BrandRule | undefined,
  developerPercent: number | null,
): RiskAssessment {
  const warnings: string[] = [];
  let riskScore = 0;
  let blocksPreciseFormula = false;

  if (!input.manualBaseConfirmed) {
    warnings.push(
      "尚未人工確認目前底色；照片與色卡只能作為參考，需現場確認後再決定配方。",
    );
    riskScore += 2;
  }

  if (!brandRule || brandRule.verified !== "verified") {
    warnings.push(
      "品牌資料未完整 verified；不可輸出精確品牌配方，只能提供通用參考方向。",
    );
    riskScore += brandRule?.verified === "partial" ? 2 : 3;
    blocksPreciseFormula = true;
  }

  const levelDiff = input.targetLevel - input.currentLevel;

  if (levelDiff >= 4 && !isBleachLikeService(input.serviceType)) {
    warnings.push(
      "目標色比目前髮色高 4 度以上，非漂髮或高明度染服務屬高風險提淺；請先評估是否改用漂髮、分段操作或降低目標。",
    );
    riskScore += 3;

    const hasBlockingRisk =
      input.damageLevel === "high" ||
      input.damageLevel === "extreme" ||
      input.hasBoxDyeOrBlackDye === "yes" ||
      isRepeatedBleachCount(input.bleachCount) ||
      hasHighRiskArtificialPigment(input) ||
      !brandRule ||
      brandRule.verified !== "verified";

    if (hasBlockingRisk) {
      warnings.push(
        "目前提淺幅度過大，且存在高風險條件，不建議由系統直接產生精確克數。請先進行髮束測試，並由資深設計師現場判斷。",
      );
      blocksPreciseFormula = true;
    }
  }

  if (input.damageLevel === "high") {
    warnings.push("高受損髮不建議使用高濃度雙氧或強提淺流程。");
    riskScore += 2;
  }

  if (input.damageLevel === "extreme") {
    warnings.push("極度受損髮需先做髮束測試與專業評估，不建議直接強漂或高明度提淺。");
    riskScore += 4;
    if (isBleachLikeService(input.serviceType)) {
      blocksPreciseFormula = true;
    }
  }

  if (input.hasBleached && (input.bleachCount === "2" || input.bleachCount === "3+")) {
    warnings.push("漂過多次的髮況不建議再次強漂，需分段檢查彈性與斷裂風險。");
    riskScore += input.bleachCount === "3+" ? 4 : 2;
    if (input.serviceType === "bleach") {
      blocksPreciseFormula = true;
    }
  }

  if (input.hasBoxDyeOrBlackDye === "yes") {
    warnings.push("黑染或盒染殘留不可保證一次達標，可能需要分次處理或先做髮束測試。");
    riskScore += 4;
    if (input.targetLevel - input.currentLevel >= 2) {
      blocksPreciseFormula = true;
    }
  }

  if (input.hasBoxDyeOrBlackDye === "unknown") {
    warnings.push("黑染或盒染歷史不確定，需先確認色素殘留後再決定提淺策略。");
    riskScore += 2;
  }

  if (input.artificialPigmentResidue.length > 0) {
    warnings.push(
      "紅／藍／綠／紫等人工色素殘留可能影響結果，補色方向需由設計師依現場底色判斷。",
    );
    riskScore += 2;
  }

  if (input.nearScalp && developerPercent !== null && developerPercent >= 9) {
    warnings.push("頭皮附近操作不建議使用高濃度雙氧。");
    riskScore += 3;
    blocksPreciseFormula = true;
  }

  if (input.needsGreyCoverage || input.greyPercentage !== "0") {
    warnings.push("白髮覆蓋通常需要自然基底色輔助，比例仍需依品牌系統與抗拒白髮狀態調整。");
    riskScore += input.greyPercentage === "76-100" ? 2 : 1;
  }

  if (riskScore >= 7 && !input.acceptsHighRisk) {
    warnings.push("目前條件累積風險偏高；未接受高風險提醒時，系統不輸出精確克數。");
    blocksPreciseFormula = true;
  }

  return {
    warnings: Array.from(new Set(warnings)),
    riskScore,
    blocksPreciseFormula,
  };
}
