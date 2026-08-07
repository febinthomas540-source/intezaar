import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Intezaar — write it, seal it and post it";
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
          background: "linear-gradient(135deg, #24140f 0%, #4d2a20 52%, #8f5638 100%)",
          color: "#fff0dc",
          padding: "66px 72px",
          fontFamily: "serif",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 82% 20%, rgba(255,214,153,.22), transparent 28%)" }} />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "63%", zIndex: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28 }}>
            <div style={{ width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 99, background: "#a7352a", color: "#f7d7aa", boxShadow: "inset 0 0 0 5px rgba(74,17,11,.22)" }}>I</div>
            <span>Intezaar</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ fontSize: 88, lineHeight: .93, letterSpacing: "-4px" }}>
              Write it.<br />Seal it.<br />Post it.
            </div>
            <div style={{ width: "92%", fontFamily: "sans-serif", fontSize: 24, lineHeight: 1.45, color: "rgba(255,240,220,.76)" }}>
              A private digital letter posted now and opened at the moment you choose.
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", right: 78, top: 58, width: 360, height: 520 }}>
          <div style={{ position: "absolute", left: 92, top: 34, width: 220, height: 430, borderRadius: "110px 110px 28px 28px", background: "linear-gradient(100deg, #761b18, #b43b30 50%, #681512)", boxShadow: "0 34px 65px rgba(0,0,0,.38), inset 18px 0 28px rgba(255,255,255,.06)" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 56, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "#f7d3a5" }}>
              <span style={{ fontSize: 22 }}>डाक</span>
              <strong style={{ fontFamily: "sans-serif", fontSize: 14, letterSpacing: 2 }}>INTEZAAR MAIL</strong>
            </div>
            <div style={{ position: "absolute", left: 34, right: 34, top: 137, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: "#260b09", fontFamily: "sans-serif", fontSize: 10, letterSpacing: 3, color: "#f2cf9c" }}>LETTERS</div>
            <div style={{ position: "absolute", left: 54, right: 54, bottom: 72, height: 102, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, border: "3px double rgba(247,211,165,.48)", color: "#f4d1a0", fontFamily: "sans-serif", fontSize: 14, letterSpacing: 2 }}>POSTED</div>
            <div style={{ position: "absolute", left: 40, right: 40, bottom: -18, height: 26, borderRadius: 5, background: "#5b1712" }} />
          </div>

          <div style={{ position: "absolute", left: 2, top: 130, width: 220, height: 140, transform: "rotate(-7deg)", borderRadius: 8, background: "linear-gradient(145deg, #f5e4c5, #d3aa77)", color: "#4a3024", boxShadow: "0 22px 42px rgba(0,0,0,.28)" }}>
            <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0, 50% 60%, 100% 0)", background: "linear-gradient(#f9ebd2,#d9b27f)" }} />
            <span style={{ position: "absolute", left: 20, bottom: 20, fontSize: 21, fontStyle: "italic" }}>For someone special</span>
            <div style={{ position: "absolute", left: 92, top: 58, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 99, background: "#a7352a", color: "#f5d0a1", fontSize: 19 }}>I</div>
          </div>

          <div style={{ position: "absolute", right: 0, bottom: 24, width: 230, padding: "18px 20px", borderRadius: 14, background: "rgba(255,244,227,.94)", color: "#4a3024", boxShadow: "0 18px 36px rgba(0,0,0,.22)" }}>
            <span style={{ display: "flex", fontFamily: "sans-serif", fontSize: 9, letterSpacing: 2, color: "#9c392e" }}>OPENS LATER</span>
            <strong style={{ display: "flex", marginTop: 7, fontSize: 25 }}>14 August · 8 PM</strong>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
