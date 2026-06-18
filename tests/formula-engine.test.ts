import { describe, expect, it } from "vitest";
import { DEFAULT_FORMULA_INPUT } from "@/lib/constants";
import { calculateFormula } from "@/lib/formula-engine";
import type { FormulaInput } from "@/lib/types";

function buildInput(overrides: Partial<FormulaInput> = {}): FormulaInput {
  return {
    ...DEFAULT_FORMULA_INPUT,
    brandId: "loreal",
    productLineId: "majirel",
    manualBaseConfirmed: true,
    observedUndertone: "none",
    desiredTotalColorGrams: 60,
    ...overrides,
  };
}

describe("calculateFormula", () => {
  it("calculates developer grams from verified brand ratio", () => {
    const output = calculateFormula(buildInput());

    expect(output.mixingRatio).toBe("1:1.5");
    expect(output.totalColorGrams).toBe(60);
    expect(output.totalDeveloperGrams).toBe(90);
    expect(output.confidenceLevel).toBe("high");
  });

  it("adds natural base support for grey coverage", () => {
    const output = calculateFormula(
      buildInput({
        serviceType: "grey-coverage",
        greyPercentage: "51-75",
        needsGreyCoverage: true,
      }),
    );
    const base = output.formulaItems.find((item) => item.role === "base");

    expect(base?.grams).toBe(30);
    expect(output.developer.developerPercent).toBe(6);
  });

  it("does not output precise grams for unverified generic rules", () => {
    const output = calculateFormula(
      buildInput({
        brandId: "generic",
        productLineId: "generic-permanent-rules",
      }),
    );

    expect(output.totalColorGrams).toBeNull();
    expect(output.totalDeveloperGrams).toBeNull();
    expect(output.formulaItems[0].role).toBe("reference");
    expect(output.confidenceLevel).toBe("low");
  });

  it("does not output precise grams for partial brand rules", () => {
    const output = calculateFormula(
      buildInput({
        brandId: "schwarzkopf",
        productLineId: "igora-royal",
      }),
    );

    expect(output.totalColorGrams).toBeNull();
    expect(output.totalDeveloperGrams).toBeNull();
    expect(output.formulaItems[0].role).toBe("reference");
    expect(output.confidenceLevel).toBe("low");
  });

  it("calculates precise grams for verified IGORA ROYAL ABSOLUTES", () => {
    const output = calculateFormula(
      buildInput({
        brandId: "schwarzkopf",
        productLineId: "igora-royal-absolutes",
      }),
    );

    expect(output.mixingRatio).toBe("1:1");
    expect(output.totalColorGrams).toBe(60);
    expect(output.totalDeveloperGrams).toBe(60);
    expect(output.developer.developerPercent).toBe(9);
  });

  it("keeps official-source flexible-ratio lighteners partial", () => {
    const output = calculateFormula(
      buildInput({
        brandId: "wella",
        productLineId: "blondor-multiblonde-powder",
        serviceType: "bleach",
      }),
    );

    expect(output.mixingRatio).toBe("1:1.5-1:2");
    expect(output.totalColorGrams).toBeNull();
    expect(output.totalDeveloperGrams).toBeNull();
    expect(output.formulaItems[0].role).toBe("reference");
  });

  it("does not output precise grams for Canbran Paul Mitchell candidate lines", () => {
    const candidateLines: Array<{
      productLineId: string;
      serviceType: FormulaInput["serviceType"];
    }> = [
      { productLineId: "paul-mitchell-color-xg", serviceType: "permanent" },
      { productLineId: "paul-mitchell-the-demi", serviceType: "post-fade-toning" },
      { productLineId: "paul-mitchell-the-color-10", serviceType: "grey-coverage" },
      { productLineId: "paul-mitchell-skylight", serviceType: "bleach" },
    ];

    for (const candidate of candidateLines) {
      const output = calculateFormula(
        buildInput({
          brandId: "canbran-paul-mitchell",
          productLineId: candidate.productLineId,
          serviceType: candidate.serviceType,
        }),
      );

      expect(output.totalColorGrams).toBeNull();
      expect(output.totalDeveloperGrams).toBeNull();
      expect(output.formulaItems[0].role).toBe("reference");
      expect(output.confidenceLevel).toBe("low");
      expect(output.riskWarnings.join(" ")).toContain("品牌資料未完整 verified");
    }
  });

  it("does not output precise grams for LebeL edol and MATERIA candidate lines", () => {
    const candidateLines: Array<{
      productLineId: string;
      serviceType: FormulaInput["serviceType"];
    }> = [
      { productLineId: "lebel-edol", serviceType: "permanent" },
      { productLineId: "lebel-edol-qon", serviceType: "grey-coverage" },
      { productLineId: "lebel-edol-bleach", serviceType: "bleach" },
      { productLineId: "lebel-materia", serviceType: "permanent" },
      { productLineId: "lebel-materia-mu", serviceType: "post-fade-toning" },
      { productLineId: "lebel-materia-g", serviceType: "grey-coverage" },
    ];

    for (const candidate of candidateLines) {
      const output = calculateFormula(
        buildInput({
          brandId: "lebel",
          productLineId: candidate.productLineId,
          serviceType: candidate.serviceType,
        }),
      );

      expect(output.totalColorGrams).toBeNull();
      expect(output.totalDeveloperGrams).toBeNull();
      expect(output.formulaItems[0].role).toBe("reference");
      expect(output.confidenceLevel).toBe("low");
      expect(output.riskWarnings.join(" ")).toContain("品牌資料未完整 verified");
      expect(output.processSteps.join(" ")).toContain("官方技術手冊確認");
    }
  });

  it("blocks precise grams for high-risk black dye lift", () => {
    const output = calculateFormula(
      buildInput({
        currentLevel: 3,
        targetLevel: 7,
        hasBoxDyeOrBlackDye: "yes",
      }),
    );

    expect(output.totalColorGrams).toBeNull();
    expect(output.totalDeveloperGrams).toBeNull();
    expect(output.riskWarnings.join(" ")).toContain("黑染");
  });

  it("keeps neutralization grams directional", () => {
    const output = calculateFormula(
      buildInput({
        needsToning: true,
        targetTone: "grey",
        observedUndertone: "orange",
      }),
    );
    const additive = output.formulaItems.find((item) => item.role === "additive");

    expect(additive?.grams).toBeNull();
    expect(additive?.note).toContain("藍");
  });
});
