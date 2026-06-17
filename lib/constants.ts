import type {
  ArtificialPigment,
  BleachCount,
  DamageLevel,
  FormulaInput,
  GreyPercentage,
  HairDensity,
  HairLength,
  ObservedUndertone,
  ServiceType,
  TargetTone,
  TriState,
} from "@/lib/types";

export const PROFESSIONAL_CHECK_REQUIRED =
  "本工具僅供美髮設計師作為配方輔助；最終配方、底色判斷、髮束測試與現場操作需由專業設計師確認。";

export const SERVICE_TYPE_OPTIONS: Array<{ value: ServiceType; label: string }> =
  [
    { value: "permanent", label: "永久染" },
    { value: "retouch", label: "補染" },
    { value: "grey-coverage", label: "白髮覆蓋" },
    { value: "color-correction", label: "色彩校正" },
    { value: "bleach", label: "漂髮" },
    { value: "high-lift", label: "高明度染" },
    { value: "post-fade-toning", label: "退色後補色" },
    { value: "cool-tone-adjustment", label: "霧感／冷色調整" },
  ];

export const TARGET_TONE_OPTIONS: Array<{ value: TargetTone; label: string }> = [
  { value: "natural-brown", label: "自然棕" },
  { value: "cool-brown", label: "冷棕" },
  { value: "misty-brown", label: "霧棕" },
  { value: "grey", label: "灰" },
  { value: "blue-black", label: "藍黑" },
  { value: "violet", label: "紫" },
  { value: "red", label: "紅" },
  { value: "copper-orange", label: "橘銅" },
  { value: "gold", label: "金" },
  { value: "beige-brown", label: "米棕" },
  { value: "other", label: "其他" },
];

export const GREY_PERCENTAGE_OPTIONS: Array<{
  value: GreyPercentage;
  label: string;
}> = [
  { value: "0", label: "0%" },
  { value: "1-25", label: "1-25%" },
  { value: "26-50", label: "26-50%" },
  { value: "51-75", label: "51-75%" },
  { value: "76-100", label: "76-100%" },
];

export const HAIR_LENGTH_OPTIONS: Array<{ value: HairLength; label: string }> = [
  { value: "short", label: "短髮" },
  { value: "medium", label: "中長髮" },
  { value: "long", label: "長髮" },
  { value: "extra-long", label: "超長髮" },
];

export const HAIR_DENSITY_OPTIONS: Array<{ value: HairDensity; label: string }> =
  [
    { value: "low", label: "少" },
    { value: "medium", label: "中" },
    { value: "high", label: "多" },
  ];

export const DAMAGE_LEVEL_OPTIONS: Array<{ value: DamageLevel; label: string }> =
  [
    { value: "healthy", label: "健康" },
    { value: "light", label: "輕微受損" },
    { value: "medium", label: "中度受損" },
    { value: "high", label: "高度受損" },
    { value: "extreme", label: "極度受損" },
  ];

export const BLEACH_COUNT_OPTIONS: Array<{ value: BleachCount; label: string }> =
  [
    { value: "0", label: "0" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3+", label: "3+" },
  ];

export const TRI_STATE_OPTIONS: Array<{ value: TriState; label: string }> = [
  { value: "no", label: "否" },
  { value: "yes", label: "是" },
  { value: "unknown", label: "不確定" },
];

export const ARTIFICIAL_PIGMENT_OPTIONS: Array<{
  value: ArtificialPigment;
  label: string;
}> = [
  { value: "red", label: "紅色" },
  { value: "blue", label: "藍色" },
  { value: "green", label: "綠色" },
  { value: "violet", label: "紫色" },
  { value: "other", label: "其他" },
];

export const OBSERVED_UNDERTONE_OPTIONS: Array<{
  value: ObservedUndertone;
  label: string;
}> = [
  { value: "unknown", label: "尚未確認" },
  { value: "none", label: "無明顯偏色" },
  { value: "yellow", label: "黃底" },
  { value: "orange", label: "橘底" },
  { value: "red", label: "紅底" },
  { value: "green", label: "綠底" },
  { value: "blue", label: "藍底" },
  { value: "violet", label: "紫底" },
];

export const LEVEL_OPTIONS = Array.from({ length: 10 }, (_, index) => index + 1);

export const DEFAULT_FORMULA_INPUT: FormulaInput = {
  serviceType: "permanent",
  brandId: "generic",
  productLineId: "generic-permanent-rules",
  currentLevel: 5,
  targetLevel: 6,
  targetTone: "natural-brown",
  greyPercentage: "0",
  hairLength: "medium",
  hairDensity: "medium",
  damageLevel: "healthy",
  hasBleached: false,
  bleachCount: "0",
  hasBoxDyeOrBlackDye: "no",
  artificialPigmentResidue: [],
  nearScalp: false,
  desiredTotalColorGrams: undefined,
  needsGreyCoverage: false,
  needsToning: false,
  acceptsHighRisk: false,
  manualBaseConfirmed: false,
  observedUndertone: "unknown",
};

const BASE_COLOR_GRAMS_BY_LENGTH: Record<HairLength, number> = {
  short: 40,
  medium: 70,
  long: 100,
  "extra-long": 130,
};

const DENSITY_MULTIPLIER: Record<HairDensity, number> = {
  low: 0.85,
  medium: 1,
  high: 1.25,
};

export function estimateTotalColorGrams(
  hairLength: HairLength,
  hairDensity: HairDensity,
) {
  return Math.round(
    BASE_COLOR_GRAMS_BY_LENGTH[hairLength] * DENSITY_MULTIPLIER[hairDensity],
  );
}

export function getLabel<T extends string>(
  options: Array<{ value: T; label: string }>,
  value: T,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}
