import { describe, expect, it } from "vitest";
import { getBrandRule } from "@/lib/brand-rules";
import { auditBrandRule } from "@/lib/rule-audit";

describe("rule audit", () => {
  it("shows missing items for partial Canbran Paul Mitchell rules", () => {
    const rule = getBrandRule(
      "canbran-paul-mitchell",
      "paul-mitchell-the-color-10",
    );

    expect(rule).toBeDefined();

    const audit = auditBrandRule(rule!);

    expect(audit.verified).toBe("partial");
    expect(audit.missingItems).toContain("可精準建模的混合比例");
    expect(audit.missingItems).toContain("白髮覆蓋或灰髮霧化規則");
    expect(audit.nextAction).toContain("混合比例");
  });

  it("keeps verified rules on recurring review", () => {
    const rule = getBrandRule("loreal", "majirel");

    expect(rule).toBeDefined();

    const audit = auditBrandRule(rule!);

    expect(audit.verified).toBe("verified");
    expect(audit.blockers.join(" ")).toContain("定期比對");
  });
});
