import { ImageResponse } from "next/og";

export const alt = "HairColor Formula Assistant";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #141817 0%, #f4efe5 100%)",
          color: "#fdfbf6",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          padding: 72,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              alignItems: "center",
              border: "2px solid rgba(255,255,255,0.45)",
              borderRadius: 32,
              display: "flex",
              fontSize: 52,
              fontWeight: 700,
              height: 132,
              justifyContent: "center",
              width: 132,
            }}
          >
            HFA
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 62, fontWeight: 700 }}>
              HairColor Formula Assistant
            </div>
            <div style={{ color: "#f4efe5", fontSize: 34 }}>
              美髮染髮配方助理
            </div>
          </div>
        </div>
        <div
          style={{
            background: "rgba(15, 118, 110, 0.92)",
            borderRadius: 28,
            color: "#f8fafc",
            display: "flex",
            flexDirection: "column",
            fontSize: 30,
            gap: 14,
            lineHeight: 1.35,
            padding: 36,
            width: 360,
          }}
        >
          <span>配方方向</span>
          <span>雙氧建議</span>
          <span>風險提醒</span>
          <span>信心等級</span>
        </div>
      </div>
    ),
    size,
  );
}
