import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Intezaar — memories that take time to arrive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #17130f 0%, #342a22 54%, #6b5540 100%)",
          color: "#eee5d8",
          padding: "68px 72px",
          fontFamily: "serif",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 82% 18%, rgba(214,181,126,.22), transparent 26%)" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "64%", zIndex: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13, fontSize: 27 }}>
            <div style={{ width: 8, height: 8, borderRadius: 99, background: "#8d4038", boxShadow: "0 0 0 6px rgba(141,64,56,.2)" }} />
            <span>Intezaar</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 76, lineHeight: .96, letterSpacing: "-3px" }}>
              Some memories should not arrive instantly.
            </div>
            <div style={{ width: "85%", fontFamily: "sans-serif", fontSize: 24, lineHeight: 1.45, color: "rgba(238,229,216,.68)" }}>
              One photograph, voice or keepsake opens each day before the final sealed letter.
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", right: 70, top: 70, width: 350, height: 460 }}>
          <div style={{ position: "absolute", left: 18, top: 48, width: 280, height: 345, transform: "rotate(-7deg)", background: "#a98e6b", boxShadow: "0 24px 55px rgba(0,0,0,.28)" }} />
          <div style={{ position: "absolute", left: 58, top: 20, width: 280, height: 360, transform: "rotate(4deg)", background: "#d5c4a7", boxShadow: "0 24px 55px rgba(0,0,0,.28)" }} />
          <div style={{ position: "absolute", left: 35, top: 5, width: 285, height: 375, padding: "32px", transform: "rotate(-1deg)", background: "#e8dec9", color: "#2c241e", boxShadow: "0 30px 70px rgba(0,0,0,.32)" }}>
            <div style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: 3, color: "#7b342f" }}>PRIVATE MEMORY JOURNEY</div>
            <div style={{ marginTop: 105, fontSize: 38, lineHeight: 1.05 }}>For the person who waited.</div>
            <div style={{ marginTop: 22, height: 1, background: "rgba(44,36,30,.24)" }} />
            <div style={{ marginTop: 18, fontFamily: "sans-serif", fontSize: 15, lineHeight: 1.5, color: "#6f6255" }}>Photographs. Voices. Keepsakes. One final letter.</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
