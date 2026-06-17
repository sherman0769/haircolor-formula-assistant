import { describe, expect, it } from "vitest";
import { getBrandRules, getSourceRecords } from "@/lib/brand-rules";

describe("brand rules", () => {
  it("has source metadata for every brand rule", () => {
    const sourceIds = new Set(getSourceRecords().map((source) => source.id));

    for (const rule of getBrandRules()) {
      expect(rule.sourceIds.length).toBeGreaterThan(0);
      expect(rule.sourceTitle).toBeTruthy();
      expect(rule.sourceType).toBeTruthy();
      expect(rule.retrievedAt).toBeTruthy();
      expect(rule.sourceNote).toBeTruthy();

      for (const sourceId of rule.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("does not mark generic rules as verified", () => {
    const genericRules = getBrandRules().filter(
      (rule) => rule.brandId === "generic",
    );

    expect(genericRules.length).toBeGreaterThan(0);
    expect(genericRules.every((rule) => rule.verified !== "verified")).toBe(
      true,
    );
  });

  it("has at least one mixing rule and developer rule per product line", () => {
    for (const rule of getBrandRules()) {
      expect(rule.rules.mixingRules.length).toBeGreaterThan(0);
      expect(rule.rules.developerRules.length).toBeGreaterThan(0);
    }
  });
});
