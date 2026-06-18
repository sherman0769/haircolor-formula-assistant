import { describe, expect, it } from "vitest";
import {
  APP_VERSION,
  betaTrialHighlights,
  feedbackTemplate,
  launchMessage,
} from "@/lib/app-meta";

describe("beta trial metadata", () => {
  it("exposes beta version and privacy-safe trial messages", () => {
    expect(APP_VERSION).toContain("beta");
    expect(betaTrialHighlights.join(" ")).toContain("不儲存顧客資料");
    expect(betaTrialHighlights.join(" ")).toContain("不儲存配方紀錄");
  });

  it("includes structured feedback and launch copy", () => {
    expect(feedbackTemplate).toContain("使用裝置與瀏覽器");
    expect(feedbackTemplate).toContain("品牌與產品線");
    expect(launchMessage).toContain("免費 Beta 試用");
    expect(launchMessage).toContain("不保證染髮結果");
  });
});
