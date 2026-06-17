import type { ObservedUndertone, TargetTone } from "@/lib/types";

type CorrectionRule = {
  correctiveTone: string;
  advice: string;
};

const CORRECTION_RULES: Record<ObservedUndertone, CorrectionRule | null> = {
  none: null,
  unknown: null,
  yellow: {
    correctiveTone: "紫",
    advice:
      "目前底色偏黃，若目標是灰霧或冷色，可考慮紫色系方向調整；實際克數需依品牌調彩濃度與設計師經驗決定。",
  },
  orange: {
    correctiveTone: "藍",
    advice:
      "目前底色偏橘，若目標是冷棕、灰或霧感，可考慮藍色系方向調整；實際克數需依品牌調彩濃度與設計師經驗決定。",
  },
  red: {
    correctiveTone: "綠",
    advice:
      "目前底色偏紅，若目標是冷棕或霧棕，可考慮綠色系方向調整；實際克數需依品牌調彩濃度與設計師經驗決定。",
  },
  green: {
    correctiveTone: "紅",
    advice:
      "目前底色偏綠，可考慮紅色系方向修正；實際克數需依品牌調彩濃度與設計師經驗決定。",
  },
  blue: {
    correctiveTone: "橘／銅",
    advice:
      "目前底色偏藍，可考慮橘或銅色系方向修正；實際克數需依品牌調彩濃度與設計師經驗決定。",
  },
  violet: {
    correctiveTone: "黃／金",
    advice:
      "目前底色偏紫，可考慮黃或金色系方向修正；實際克數需依品牌調彩濃度與設計師經驗決定。",
  },
};

const COOL_TARGET_TONES: TargetTone[] = [
  "cool-brown",
  "misty-brown",
  "grey",
  "blue-black",
];

export function getComplementaryCorrection(undertone: ObservedUndertone) {
  return CORRECTION_RULES[undertone];
}

export function shouldSuggestNeutralization(
  undertone: ObservedUndertone,
  targetTone: TargetTone,
) {
  if (undertone === "unknown" || undertone === "none") {
    return false;
  }

  if (COOL_TARGET_TONES.includes(targetTone)) {
    return true;
  }

  return ["green", "blue", "violet"].includes(undertone);
}

export function buildNeutralizationAdvice(
  undertone: ObservedUndertone,
  targetTone: TargetTone,
) {
  const correction = getComplementaryCorrection(undertone);

  if (!correction || !shouldSuggestNeutralization(undertone, targetTone)) {
    return null;
  }

  return correction;
}
