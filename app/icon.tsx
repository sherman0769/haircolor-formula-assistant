import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#141817",
          color: "#f4efe5",
          display: "flex",
          fontSize: 132,
          fontWeight: 800,
          height: "100%",
          justifyContent: "center",
          letterSpacing: -4,
          width: "100%",
        }}
      >
        HFA
      </div>
    ),
    size,
  );
}
