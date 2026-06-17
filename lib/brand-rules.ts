import genericRules from "@/data/brand-rules/generic-rules.json";
import canbranPaulMitchellRules from "@/data/brand-rules/canbran-paul-mitchell.json";
import lorealMajirelRules from "@/data/brand-rules/loreal-majirel.json";
import milbonSophistoneRules from "@/data/brand-rules/milbon-sophistone.json";
import schwarzkopfBlondmeRules from "@/data/brand-rules/schwarzkopf-blondme.json";
import schwarzkopfIgoraRules from "@/data/brand-rules/schwarzkopf-igora-royal.json";
import wellaKolestonRules from "@/data/brand-rules/wella-koleston-perfect.json";
import sources from "@/data/sources/sources.json";
import type { BrandRule, SourceRecord } from "@/lib/types";

const brandRules = [
  ...(wellaKolestonRules as BrandRule[]),
  ...(lorealMajirelRules as BrandRule[]),
  ...(schwarzkopfIgoraRules as BrandRule[]),
  ...(schwarzkopfBlondmeRules as BrandRule[]),
  ...(milbonSophistoneRules as BrandRule[]),
  ...(canbranPaulMitchellRules as BrandRule[]),
  ...(genericRules as BrandRule[]),
];

const sourceRecords = sources as SourceRecord[];

export function getBrandRules() {
  return brandRules;
}

export function getBrandRule(brandId: string, productLineId: string) {
  return brandRules.find(
    (rule) =>
      rule.brandId === brandId && rule.productLineId === productLineId,
  );
}

export function getSourceRecords() {
  return sourceRecords;
}

export function getSourcesByIds(sourceIds: string[]) {
  return sourceIds.map((sourceId) => {
    const source = sourceRecords.find((record) => record.id === sourceId);

    return (
      source ?? {
        id: sourceId,
        title: "未登錄來源",
        publisher: "Unknown",
        sourceType: "unknown",
        url: "",
        retrievedAt: "",
        verification: "unverified" as const,
        notes: "資料來源缺失，不能視為 verified。",
      }
    );
  });
}

export function getBrandOptions() {
  const brands = new Map<string, string>();

  for (const rule of brandRules) {
    brands.set(rule.brandId, rule.brandName);
  }

  return Array.from(brands.entries()).map(([value, label]) => ({
    value,
    label,
  }));
}

export function getProductLineOptions(brandId: string) {
  return brandRules
    .filter((rule) => rule.brandId === brandId)
    .map((rule) => ({
      value: rule.productLineId,
      label: rule.productLineName,
      verified: rule.verified,
    }));
}

export function getDefaultProductLineForBrand(brandId: string) {
  return (
    brandRules.find((rule) => rule.brandId === brandId)?.productLineId ??
    "generic-permanent-rules"
  );
}
