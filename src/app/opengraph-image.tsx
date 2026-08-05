import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Intezaar — a nostalgic Indian letter carried by post and rail";
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
          background: "linear-gradient(145deg, #3b211a 0%, #8f3a27 45%, #d29a5d 100%)",
          color: "#fff3df",
          padding: "70px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 78% 18%, rgba(255,226,176,.36), transparent 22%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "65%", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: 28 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 62,
                height: 62,
                borderRadius: 999,
                background: "#b43d29",
                border: "2px solid rgba(255,238,211,.5)",
              }}
            >
              I
            </div>
            <span>Intezaar</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ fontSize: 72, lineHeight: 1.02, letterSpacing: "-3px" }}>
              A letter carried by post and rail.
            </div>
            <div style={{ fontFamily: "sans-serif", fontSize: 26, color: "rgba(255,243,223,.78)", lineHeight: 1.4 }}>
              Indian post boxes, railway mail, monsoon memories and a final arrival worth waiting for.
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 90,
            bottom: 80,
            width: 250,
            height: 320,
            borderRadius: "32px 32px 24px 24px",
            background: "linear-gradient(#d95338, #962d20)",
            boxShadow: "0 30px 60px rgba(0,0,0,.28)",
          }}
        >
          <div style={{ position: "absolute", top: 52, left: 55, right: 55, height: 20, borderRadius: 20, background: "#4c120d" }} />
          <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", fontFamily: "sans-serif", fontWeight: 700, fontSize: 30, letterSpacing: 5 }}>
            POST
          </div>
          <div
            style={{
              position: "absolute",
              top: 25,
              right: -35,
              width: 145,
              height: 92,
              transform: "rotate(8deg)",
              borderRadius: 10,
              background: "#f3dfbd",
              boxShadow: "0 18px 30px rgba(0,0,0,.2)",
            }}
          >
            <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0, 50% 66%, 100% 0)", background: "#fff0d2" }} />
            <div style={{ position: "absolute", left: 57, top: 43, width: 28, height: 28, borderRadius: 99, background: "#a43828" }} />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
