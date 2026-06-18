import { describe, expect, it } from "vitest";
import { buildDownloadReport, buildReport } from "@/components/ResultActions";
import type { FormulaOutput } from "@/lib/types";

const sampleResult: FormulaOutput = {
  formulaItems: [
    {
      label: "主色染膏",
      grams: 60,
      role: "main",
      note: "測試配方項目",
    },
  ],
  developer: {
    developerPercent: 6,
    volume: 20,
    reason: "測試雙氧建議",
    restrictions: [],
  },
  totalColorGrams: 60,
  totalDeveloperGrams: 60,
  mixingRatio: "1:1",
  processSteps: ["測試施工流程"],
  riskWarnings: ["測試風險提醒"],
  confidenceLevel: "medium",
  sourceSummary: [
    {
      sourceId: "test-source",
      title: "測試品牌技術資料",
      sourceType: "official_pdf",
      verification: "verified",
      url: "https://example.com/source.pdf",
    },
  ],
  professionalCheckRequired:
    "最終配方需由專業美髮設計師確認，品牌規則以官方最新技術手冊為準。",
};

describe("ResultActions download report", () => {
  it("adds UTF-8 BOM and Windows-friendly line endings for downloaded text", () => {
    const report = buildDownloadReport(sampleResult);

    expect(report.charCodeAt(0)).toBe(0xfeff);
    expect(report).toContain("\r\n");
    expect(report).toContain("美髮染髮配方助理");
    expect(report).toContain("專業美髮設計師確認");
  });

  it("builds a professional salon formula sheet", () => {
    const report = buildReport(sampleResult);

    expect(report).toContain("沙龍專業配方單");
    expect(report).toContain("26肯邦AI進階課程｜李詩民");
    expect(report).toContain("顧客姓名");
    expect(report).toContain("設計師簽名");
    expect(report).toContain("七、資料來源");
    expect(report).toContain("測試品牌技術資料");
  });
});
