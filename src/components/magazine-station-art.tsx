import type { RecipientJourneyDay } from "@/lib/recipient-journey";
import routeStyles from "./recipient-magazine-route.module.css";

const styles = routeStyles;

export function StationArt({ day, index }: { day: RecipientJourneyDay; index: number }) {
  const rain = day.scene === "konkan" || day.scene === "kottayam";
  const palms = day.scene === "konkan" || day.scene === "kottayam" || day.scene === "alappuzha";
  const colors = [
    ["#8dd0e4", "#f4c86f", "#d65a3b", "#53965d"],
    ["#8cc8e0", "#e9aa54", "#c95c36", "#7f8c4e"],
    ["#729aaa", "#b9d3c3", "#b64732", "#39734c"],
    ["#637f80", "#a7c9b2", "#d15537", "#356543"],
    ["#526e8f", "#efb76b", "#b84131", "#3f7755"],
  ][index];

  return (
    <svg viewBox="0 0 760 430" className={styles.stationSvg} role="img" aria-label={`Illustrated ${day.station} station`}>
      <rect width="760" height="430" rx="28" fill={colors[0]} />
      <circle cx="615" cy="76" r="46" fill={colors[1]} stroke="#3f2b24" strokeWidth="7" />
      <path d="M0 220 C120 155 220 220 330 170 C430 125 545 205 760 140 V330 H0Z" fill={colors[3]} stroke="#2f4c33" strokeWidth="7" />
      <path d="M0 290 C150 250 255 310 390 265 C510 225 620 285 760 250 V430 H0Z" fill="#315744" stroke="#263e31" strokeWidth="7" />
      <rect x="92" y="178" width="300" height="150" rx="9" fill="#f5dda1" stroke="#493329" strokeWidth="8" />
      <path d="M62 185 L240 90 L424 185Z" fill={colors[2]} stroke="#493329" strokeWidth="8" />
      <rect x="128" y="232" width="76" height="96" fill="#6f9fb3" stroke="#493329" strokeWidth="7" />
      <rect x="242" y="220" width="110" height="62" fill="#a8d7df" stroke="#493329" strokeWidth="7" />
      <rect x="470" y="202" width="206" height="72" rx="6" fill="#f4cf5a" stroke="#493329" strokeWidth="8" />
      <text x="573" y="232" textAnchor="middle" fontFamily="Georgia,serif" fontSize="19" fontWeight="700" fill="#3c2a22">{day.station.toUpperCase()}</text>
      <text x="573" y="256" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="11" letterSpacing="2" fill="#5e4031">{day.routeLabel.toUpperCase()}</text>
      {palms ? (
        <g transform="translate(655 155)">
          <path d="M0 128 C8 80 8 35 20 0" fill="none" stroke="#5c3a27" strokeWidth="12" strokeLinecap="round" />
          <path d="M20 4 C-22 -8 -55 5 -78 28 C-35 23 -8 17 20 8Z" fill="#4b9557" stroke="#2d5b38" strokeWidth="6" />
          <path d="M20 4 C58 -19 92 -14 117 5 C73 7 46 11 21 11Z" fill="#5aa761" stroke="#2d5b38" strokeWidth="6" />
          <path d="M21 6 C51 30 66 57 64 84 C42 48 29 24 17 11Z" fill="#3d804c" stroke="#2d5b38" strokeWidth="6" />
        </g>
      ) : (
        <g transform="translate(650 178)">
          <rect x="-9" y="30" width="18" height="120" rx="9" fill="#5a3927" />
          <circle cx="0" cy="20" r="55" fill="#4d8a52" stroke="#2d5936" strokeWidth="7" />
          <circle cx="-38" cy="48" r="39" fill="#5a9a5f" stroke="#2d5936" strokeWidth="6" />
        </g>
      )}
      <path d="M0 352 H760" stroke="#4b342a" strokeWidth="16" />
      <path d="M0 388 H760" stroke="#4b342a" strokeWidth="16" />
      {Array.from({ length: 14 }, (_, item) => (
        <rect key={item} x={item * 58 - 6} y="342" width="26" height="64" rx="4" fill="#9b795d" stroke="#4b342a" strokeWidth="4" />
      ))}
      <g transform="translate(400 295)">
        <rect x="0" y="0" width="150" height="62" rx="13" fill="#b94230" stroke="#4b2d26" strokeWidth="7" />
        <rect x="150" y="7" width="145" height="55" rx="10" fill="#f2d8a7" stroke="#4b2d26" strokeWidth="7" />
        <rect x="20" y="13" width="70" height="21" rx="5" fill="#e7d1aa" />
        <circle cx="45" cy="68" r="17" fill="#2b211e" stroke="#9e7c63" strokeWidth="6" />
        <circle cx="120" cy="68" r="17" fill="#2b211e" stroke="#9e7c63" strokeWidth="6" />
        <circle cx="190" cy="68" r="17" fill="#2b211e" stroke="#9e7c63" strokeWidth="6" />
        <circle cx="260" cy="68" r="17" fill="#2b211e" stroke="#9e7c63" strokeWidth="6" />
      </g>
      {rain ? (
        <g stroke="#e7f5f4" strokeWidth="4" strokeLinecap="round" opacity=".72">
          {Array.from({ length: 24 }, (_, item) => {
            const x = (item * 73) % 760;
            const y = 20 + ((item * 47) % 250);
            return <path key={item} d={`M${x} ${y} l-16 34`} />;
          })}
        </g>
      ) : null}
      <g fill="#26211e">
        <path d="M72 65 q16 -15 32 0 q-16 -7 -32 0" />
        <path d="M123 44 q13 -12 27 0 q-13 -6 -27 0" />
      </g>
    </svg>
  );
}
