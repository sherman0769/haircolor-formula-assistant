export type ServiceType =
  | "permanent"
  | "retouch"
  | "grey-coverage"
  | "color-correction"
  | "bleach"
  | "high-lift"
  | "post-fade-toning"
  | "cool-tone-adjustment";

export type VerificationStatus = "verified" | "partial" | "unverified";

export type TargetTone =
  | "natural-brown"
  | "cool-brown"
  | "misty-brown"
  | "grey"
  | "blue-black"
  | "violet"
  | "red"
  | "copper-orange"
  | "gold"
  | "beige-brown"
  | "other";

export type GreyPercentage =
  | "0"
  | "1-25"
  | "26-50"
  | "51-75"
  | "76-100";

export type HairLength = "short" | "medium" | "long" | "extra-long";

export type HairDensity = "low" | "medium" | "high";

export type DamageLevel =
  | "healthy"
  | "light"
  | "medium"
  | "high"
  | "extreme";

export type BleachCount = "0" | "1" | "2" | "3+";

export type TriState = "yes" | "no" | "unknown";

export type ArtificialPigment =
  | "red"
  | "blue"
  | "green"
  | "violet"
  | "other";

export type ObservedUndertone =
  | "none"
  | "yellow"
  | "orange"
  | "red"
  | "green"
  | "blue"
  | "violet"
  | "unknown";

export type DeveloperAdjustmentMode =
  | "none"
  | "subtractAdditiveWeight"
  | "fixedDeveloperAmount";

export type ConfidenceLevel = "high" | "medium" | "low";

export interface MixingRule {
  id: string;
  serviceType: ServiceType;
  ratio: number;
  ratioLabel: string;
  allowedDevelopers: number[];
  processingTimeMin: number;
  processingTimeMax: number;
  conditions: string[];
  warnings: string[];
}

export interface DeveloperRule {
  developerPercent: number;
  volume: number;
  liftRange: [number, number];
  recommendedUse: string[];
  restrictions: string[];
}

export interface GreyCoverageRule {
  greyPercentage: GreyPercentage;
  baseShadePercent: number;
  fashionShadePercent: number;
  note: string;
}

export interface BrandRule {
  brandId: string;
  brandName: string;
  productLineId: string;
  productLineName: string;
  region: string;
  serviceTypes: ServiceType[];
  verified: VerificationStatus;
  sourceIds: string[];
  sourceTitle: string;
  sourceType: string;
  retrievedAt: string;
  sourceNote: string;
  notes: string;
  rules: {
    developerAdjustmentMode: DeveloperAdjustmentMode;
    mixingRules: MixingRule[];
    developerRules: DeveloperRule[];
    greyCoverageRules?: GreyCoverageRule[];
    restrictions: string[];
    warnings: string[];
  };
}

export interface SourceRecord {
  id: string;
  title: string;
  publisher: string;
  sourceType: string;
  url: string;
  retrievedAt: string;
  verification: VerificationStatus;
  notes: string;
}

export interface FormulaInput {
  serviceType: ServiceType;
  brandId: string;
  productLineId: string;
  currentLevel: number;
  targetLevel: number;
  targetTone: TargetTone;
  greyPercentage: GreyPercentage;
  hairLength: HairLength;
  hairDensity: HairDensity;
  damageLevel: DamageLevel;
  hasBleached: boolean;
  bleachCount: BleachCount;
  hasBoxDyeOrBlackDye: TriState;
  artificialPigmentResidue: ArtificialPigment[];
  nearScalp: boolean;
  desiredTotalColorGrams?: number;
  needsGreyCoverage: boolean;
  needsToning: boolean;
  acceptsHighRisk: boolean;
  manualBaseConfirmed: boolean;
  observedUndertone: ObservedUndertone;
}

export interface FormulaItem {
  label: string;
  grams: number | null;
  role: "main" | "base" | "additive" | "lightener" | "reference";
  note: string;
}

export interface FormulaDeveloper {
  developerPercent: number | null;
  volume: number | null;
  reason: string;
  restrictions: string[];
}

export interface SourceSummaryItem {
  sourceId: string;
  title: string;
  sourceType: string;
  verification: VerificationStatus;
  url?: string;
}

export interface FormulaOutput {
  formulaItems: FormulaItem[];
  developer: FormulaDeveloper;
  totalColorGrams: number | null;
  totalDeveloperGrams: number | null;
  mixingRatio: string;
  processSteps: string[];
  riskWarnings: string[];
  confidenceLevel: ConfidenceLevel;
  sourceSummary: SourceSummaryItem[];
  professionalCheckRequired: string;
}
