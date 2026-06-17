import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SafetyNotice } from "@/components/SafetyNotice";

describe("SafetyNotice", () => {
  it("contains required safety and responsibility statements", () => {
    const html = renderToStaticMarkup(<SafetyNotice />);

    expect(html).toContain("不保證染髮結果");
    expect(html).toContain("過敏測試");
    expect(html).toContain("髮束測試");
    expect(html).toContain("不建議自行高風險漂髮");
    expect(html).toContain("專業美髮設計師確認");
  });
});
