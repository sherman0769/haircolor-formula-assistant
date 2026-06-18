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

  it("keeps Canbran Paul Mitchell candidates conservative", () => {
    const canbranRules = getBrandRules().filter(
      (rule) => rule.brandId === "canbran-paul-mitchell",
    );

    expect(canbranRules.map((rule) => rule.productLineId).sort()).toEqual([
      "paul-mitchell-color-xg",
      "paul-mitchell-skylight",
      "paul-mitchell-the-color-10",
      "paul-mitchell-the-demi",
    ]);
    expect(canbranRules.every((rule) => rule.verified !== "verified")).toBe(
      true,
    );
    expect(
      canbranRules.every((rule) =>
        rule.rules.restrictions.some((restriction) =>
          restriction.includes("cannot output precise grams"),
        ),
      ),
    ).toBe(true);
  });

  it("records supplemented Canbran Paul Mitchell public reference details without verification upgrade", () => {
    const canbranRules = getBrandRules().filter(
      (rule) => rule.brandId === "canbran-paul-mitchell",
    );
    const colorXg = canbranRules.find(
      (rule) => rule.productLineId === "paul-mitchell-color-xg",
    );
    const theDemi = canbranRules.find(
      (rule) => rule.productLineId === "paul-mitchell-the-demi",
    );
    const color10 = canbranRules.find(
      (rule) => rule.productLineId === "paul-mitchell-the-color-10",
    );
    const skylight = canbranRules.find(
      (rule) => rule.productLineId === "paul-mitchell-skylight",
    );

    expect(colorXg?.verified).toBe("partial");
    expect(colorXg?.sourceIds).toContain("paul-mitchell-color-xg-cosmoprof");
    expect(
      colorXg?.rules.mixingRules.find((rule) => rule.serviceType === "permanent")
        ?.allowedDevelopers,
    ).toEqual([3, 6, 9, 12]);

    expect(theDemi?.verified).toBe("partial");
    expect(theDemi?.sourceIds).toContain("paul-mitchell-the-demi-cosmoprof");
    expect(theDemi?.sourceIds).toContain(
      "paul-mitchell-processing-liquid-cosmoprof",
    );
    expect(theDemi?.rules.developerRules[0].volume).toBe(7.5);

    expect(color10?.verified).toBe("partial");
    expect(color10?.sourceIds).toContain(
      "paul-mitchell-the-color-10-cosmoprof-ca",
    );
    expect(
      color10?.rules.mixingRules.find(
        (rule) => rule.serviceType === "grey-coverage",
      )?.ratio,
    ).toBe(1.5);

    expect(skylight?.verified).toBe("partial");
    expect(skylight?.notes).toContain("Pre-Bonded Lightener");
  });

  it("adds LebeL edol and MATERIA candidates from designer feedback conservatively", () => {
    const lebelRules = getBrandRules().filter(
      (rule) => rule.brandId === "lebel",
    );

    expect(lebelRules.map((rule) => rule.productLineId).sort()).toEqual([
      "lebel-edol",
      "lebel-edol-bleach",
      "lebel-edol-qon",
      "lebel-materia",
      "lebel-materia-g",
      "lebel-materia-mu",
    ]);
    expect(lebelRules.every((rule) => rule.verified === "partial")).toBe(true);
    expect(
      lebelRules.every((rule) =>
        rule.rules.restrictions.some((restriction) =>
          restriction.includes("cannot output precise grams"),
        ),
      ),
    ).toBe(true);
    expect(
      lebelRules.every((rule) =>
        rule.rules.mixingRules.some(
          (mixingRule) =>
            mixingRule.processingTimeMin === 0 &&
            mixingRule.processingTimeMax === 0,
        ),
      ),
    ).toBe(true);
  });
});
