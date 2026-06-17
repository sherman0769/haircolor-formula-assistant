import { estimateTotalColorGrams } from "@/lib/constants";
import type { FormulaInput } from "@/lib/types";

export function validateFormulaInput(input: FormulaInput) {
  const errors: string[] = [];

  if (input.currentLevel < 1 || input.currentLevel > 10) {
    errors.push("目前髮色度數需介於 1 到 10。");
  }

  if (input.targetLevel < 1 || input.targetLevel > 10) {
    errors.push("目標髮色度數需介於 1 到 10。");
  }

  if (
    input.desiredTotalColorGrams !== undefined &&
    (!Number.isFinite(input.desiredTotalColorGrams) ||
      input.desiredTotalColorGrams <= 0)
  ) {
    errors.push("預計總染膏重量需為大於 0 的數字。");
  }

  if (input.hasBleached && input.bleachCount === "0") {
    errors.push("若已漂過，漂過次數不能為 0。");
  }

  return errors;
}

export function getRequestedTotalColorGrams(input: FormulaInput) {
  if (
    input.desiredTotalColorGrams !== undefined &&
    Number.isFinite(input.desiredTotalColorGrams) &&
    input.desiredTotalColorGrams > 0
  ) {
    return Math.round(input.desiredTotalColorGrams);
  }

  return estimateTotalColorGrams(input.hairLength, input.hairDensity);
}
