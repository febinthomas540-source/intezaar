import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Intezaar — a letter that travels by train";
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
          background: "linear-gradient(135deg, #26150f 0%, #573023 52%, #a56b45 100%)",
          color: "#fff0dc",
          padding: "68px 72px",
          fontFamily: "serif",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 82% 18%, rgba(255,211,145,.25), transparent 26%)" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "62%", zIndex: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13, fontSize: 27 }}>
            <div style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 99, background: "#a83b29", color: "#f7d7aa", boxShadow: "inset 0 0 0 4px rgba(74,17,11,.22)" }}>I</div>
            <span>Intezaar</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 79, lineHeight: .95, letterSpacing: "-3px" }}>
              A letter that travels by train.
            </div>
            <div style={{ width: "90%", fontFamily: "sans-serif", fontSize: 24, lineHeight: 1.45, color: "rgba(255,240,220,.75)" }}>
              Write it today. Let it move through Indian post offices and railway stations. Open it when it arrives.
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", right: 70, top: 70, width: 360, height: 470 }}>
          <div style={{ position: "absolute", left: 8, top: 95, width: 82, height: 155, borderRadius: 18, background: "linear-gradient(#d35238,#992d21)", boxShadow: "0 24px 50px rgba(0,0,0,.3)" }}>
            <div style={{ position: "absolute", left: 17, right: 17, top: 30, height: 10, borderRadius: 10, background: "rgba(44,9,5,.45)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 68, textAlign: "center", fontFamily: "sans-serif", fontSize: 15, letterSpacing: 3, color: "#ffe0b5" }}>POST</div>
          </div>
          <div style={{ position: "absolute", left: 70, top: 55, width: 280, height: 360, padding: "30px", transform: "rotate(-3deg)", background: "#f0dfc0", color: "#3a261d", boxShadow: "0 30px 70px rgba(0,0,0,.33)" }}>
            <div style={{ display: "flex", gap: 8, fontFamily: "sans-serif", fontSize: 10, letterSpacing: 2, color: "#9d3c2d" }}>
              <span style={{ border: "1px dashed #a96f59", padding: "7px" }}>DELHI GPO</span>
              <span style={{ border: "1px dashed #a96f59", padding: "7px" }}>BY RAIL</span>
            </div>
            <div style={{ marginTop: 95, fontSize: 42, lineHeight: 1.04 }}>For the person who waited.</div>
            <div style={{ marginTop: 26, height: 1, background: "rgba(58,38,29,.22)" }} />
            <div style={{ marginTop: 20, fontFamily: "sans-serif", fontSize: 15, lineHeight: 1.5, color: "#735c50" }}>One sealed letter · 3, 5 or 7 days · private arrival</div>
            <div style={{ position: "absolute", right: 34, bottom: 34, width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 99, background: "#a63b2b", color: "#f8d8ae", fontSize: 22 }}>I</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
