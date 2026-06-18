import { describe, expect, it } from "vitest";
import {
  APP_VERSION,
  FEEDBACK_FORM_URL,
  betaTrialHighlights,
  feedbackTemplate,
  launchMessage,
} from "@/lib/app-meta";

describe("beta trial metadata", () => {
  it("exposes beta version and privacy-safe trial messages", () => {
    expect(APP_VERSION).toContain("beta");
    expect(betaTrialHighlights.join(" ")).toContain("不儲存顧客資料");
    expect(betaTrialHighlights.join(" ")).toContain("不儲存配方紀錄");
    expect(betaTrialHighlights.join(" ")).toContain("Vercel Web Analytics");
    expect(betaTrialHighlights.join(" ")).toContain("累積訪問數");
  });

  it("includes structured feedback and launch copy", () => {
    expect(feedbackTemplate).toContain("使用裝置與瀏覽器");
    expect(feedbackTemplate).toContain("品牌與產品線");
    expect(feedbackTemplate).toContain(FEEDBACK_FORM_URL);
    expect(FEEDBACK_FORM_URL).toContain("docs.google.com/forms");
    expect(launchMessage).toContain("免費 Beta 試用");
    expect(launchMessage).toContain(FEEDBACK_FORM_URL);
    expect(launchMessage).toContain("不保證染髮結果");
  });
});
