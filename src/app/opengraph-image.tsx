import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Intezaar — memories carried home by Raahi";
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
          background: "linear-gradient(180deg, #91cfdf 0%, #d8ebe0 68%, #edcf84 100%)",
          color: "#44322d",
          padding: "64px 70px",
          fontFamily: "serif",
        }}
      >
        <div style={{ position: "absolute", right: 92, top: 62, width: 112, height: 112, borderRadius: 999, background: "#edbd4f", boxShadow: "0 0 0 22px rgba(237,189,79,.22)" }} />
        <div style={{ position: "absolute", left: -60, right: -60, bottom: -95, height: 230, borderRadius: "50% 50% 0 0", background: "#4f8b5a" }} />
        <div style={{ position: "absolute", left: 280, right: -100, bottom: -125, height: 220, borderRadius: "50% 50% 0 0", background: "#326447" }} />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "62%", zIndex: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 60, height: 60, borderRadius: 999, color: "#fffaf0", background: "#b74235" }}>I</div>
            <span>Intezaar</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 19 }}>
            <div style={{ fontSize: 72, lineHeight: .98, letterSpacing: "-3px" }}>Send a memory.<br />Let it find its way home.</div>
            <div style={{ width: "88%", fontFamily: "sans-serif", fontSize: 24, lineHeight: 1.45, color: "#6f574d" }}>
              Raahi delivers one private memory each day before the final sealed letter arrives.
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", right: 72, top: 130, width: 410, height: 340, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg viewBox="0 0 280 210" width="390" height="300">
            <g stroke="#44332f" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M78 145 C38 132 20 104 24 76 C56 91 79 105 101 128Z" fill="#6f8794" />
              <path d="M91 137 C49 103 48 57 67 24 C91 54 109 87 119 124Z" fill="#8ca1aa" />
              <path d="M103 132 C87 84 105 38 139 12 C144 55 140 94 129 128Z" fill="#aebbc0" />
              <ellipse cx="147" cy="132" rx="76" ry="48" fill="#80959f" />
              <path d="M118 130 C129 90 174 76 205 98 C185 108 171 128 169 158 C148 154 130 145 118 130Z" fill="#617985" />
              <path d="M184 113 C202 72 245 66 259 93 C240 103 225 120 218 142 C203 140 191 128 184 113Z" fill="#9aabb1" />
              <circle cx="215" cy="91" r="34" fill="#aebbc0" />
              <path d="M243 88 L273 101 L244 110Z" fill="#e2a342" />
              <circle cx="225" cy="82" r="5" fill="#2c2422" stroke="none" />
            </g>
            <g transform="translate(167 145) rotate(7)">
              <rect x="-22" y="25" width="66" height="45" rx="5" fill="#f8e8bf" stroke="#44332f" strokeWidth="4" />
              <path d="M-20 29 L11 52 L42 29" fill="#fff3d5" stroke="#44332f" strokeWidth="3" />
              <circle cx="11" cy="52" r="8" fill="#b74235" />
            </g>
          </svg>
        </div>
      </div>
    ),
    size,
  );
}
