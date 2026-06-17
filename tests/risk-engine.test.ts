import { describe, expect, it } from "vitest";
import { DEFAULT_FORMULA_INPUT } from "@/lib/constants";
import { getBrandRule } from "@/lib/brand-rules";
import { assessFormulaRisk } from "@/lib/risk-engine";

describe("assessFormulaRisk", () => {
  it("requires manual base confirmation", () => {
    const rule = getBrandRule("milbon", "sophistone-permanent");
    const risk = assessFormulaRisk(DEFAULT_FORMULA_INPUT, rule, 6);

    expect(risk.warnings.join(" ")).toContain("尚未人工確認目前底色");
    expect(risk.riskScore).toBeGreaterThan(0);
  });

  it("blocks exact formula for partial brand rules", () => {
    const rule = getBrandRule("schwarzkopf", "igora-royal");
    const risk = assessFormulaRisk(
      {
        ...DEFAULT_FORMULA_INPUT,
        brandId: "schwarzkopf",
        productLineId: "igora-royal",
        manualBaseConfirmed: true,
      },
      rule,
      6,
    );

    expect(risk.blocksPreciseFormula).toBe(true);
    expect(risk.warnings.join(" ")).toContain("未完整 verified");
  });

  it("flags repeated bleaching and extreme damage", () => {
    const rule = getBrandRule("loreal", "majirel");
    const risk = assessFormulaRisk(
      {
        ...DEFAULT_FORMULA_INPUT,
        serviceType: "bleach",
        hasBleached: true,
        bleachCount: "3+",
        damageLevel: "extreme",
        manualBaseConfirmed: true,
      },
      rule,
      6,
    );

    expect(risk.blocksPreciseFormula).toBe(true);
    expect(risk.warnings.join(" ")).toContain("漂過多次");
    expect(risk.warnings.join(" ")).toContain("極度受損");
  });

  it("flags permanent color lift of 4 levels as high risk", () => {
    const rule = getBrandRule("loreal", "majirel");
    const risk = assessFormulaRisk(
      {
        ...DEFAULT_FORMULA_INPUT,
        serviceType: "permanent",
        currentLevel: 4,
        targetLevel: 8,
        manualBaseConfirmed: true,
      },
      rule,
      12,
    );

    expect(risk.blocksPreciseFormula).toBe(false);
    expect(risk.warnings.join(" ")).toContain("4 度以上");
    expect(risk.riskScore).toBeGreaterThanOrEqual(3);
  });

  it("blocks permanent color lift of 4 levels when hair is highly damaged", () => {
    const rule = getBrandRule("loreal", "majirel");
    const risk = assessFormulaRisk(
      {
        ...DEFAULT_FORMULA_INPUT,
        serviceType: "permanent",
        currentLevel: 4,
        targetLevel: 8,
        damageLevel: "high",
        manualBaseConfirmed: true,
      },
      rule,
      6,
    );

    expect(risk.blocksPreciseFormula).toBe(true);
    expect(risk.warnings.join(" ")).toContain("目前提淺幅度過大");
  });

  it("blocks permanent color lift of 4 levels when black dye remains", () => {
    const rule = getBrandRule("loreal", "majirel");
    const risk = assessFormulaRisk(
      {
        ...DEFAULT_FORMULA_INPUT,
        serviceType: "permanent",
        currentLevel: 4,
        targetLevel: 8,
        hasBoxDyeOrBlackDye: "yes",
        manualBaseConfirmed: true,
      },
      rule,
      6,
    );

    expect(risk.blocksPreciseFormula).toBe(true);
    expect(risk.warnings.join(" ")).toContain("目前提淺幅度過大");
  });
});
