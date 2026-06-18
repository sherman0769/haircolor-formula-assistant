import { describe, expect, it } from "vitest";
import { formatPublicVisitCount } from "@/lib/visit-format";

describe("visit counter", () => {
  it("formats public visit count for homepage display", () => {
    expect(formatPublicVisitCount(0)).toBe("0");
    expect(formatPublicVisitCount(1234)).toBe("1,234");
  });

  it("shows setup state when persistent storage is missing", () => {
    expect(formatPublicVisitCount(null)).toBe("統計設定中");
  });
});
