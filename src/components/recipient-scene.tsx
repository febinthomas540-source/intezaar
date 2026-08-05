"use client";

import { AnimatePresence, motion } from "motion/react";
import type { RecipientJourneyDay } from "@/lib/recipient-journey";
import styles from "./recipient-scene.module.css";

type Phase="waiting"|"arriving"|"revealed"|"departing"|"complete";
type Palette={skyTop:string;skyBottom:string;haze:string;hills:string;trees:string;treesDark:string;platform:string;edge:string;light:string;rain?:boolean;palms?:boolean};

const palettes:Record<RecipientJourneyDay["scene"],Palette>={
  delhi:{skyTop:"#55372f",skyBottom:"#d19058",haze:"#f4c88f",hills:"#79503b",trees:"#56664a",treesDark:"#2e3c2d",platform:"#514039",edge:"#c59362",light:"#ffd79b"},
  jaipur:{skyTop:"#74483a",skyBottom:"#dda05f",haze:"#f7d39b",hills:"#a06543",trees:"#756846",treesDark:"#413a29",platform:"#65483a",edge:"#d2a06a",light:"#ffe0a9"},
  konkan:{skyTop:"#344d5a",skyBottom:"#77908d",haze:"#b8d2cc",hills:"#49685b",trees:"#3f6a50",treesDark:"#234433",platform:"#354b45",edge:"#789786",light:"#f2d69c",rain:true,palms:true},
  kottayam:{skyTop:"#253a40",skyBottom:"#58716b",haze:"#a8c5b8",hills:"#3b5a4d",trees:"#345e45",treesDark:"#1e3b2c",platform:"#30443d",edge:"#6e8d79",light:"#f4d39a",rain:true,palms:true},
  alappuzha:{skyTop:"#1e2939",skyBottom:"#566d78",haze:"#ced9d1",hills:"#3f5b50",trees:"#3d6850",treesDark:"#203e30",platform:"#30443d",edge:"#78947e",light:"#ffe1aa",palms:true},
};

const trees=[{x:45,y:430,s:.85},{x:115,y:455,s:1.05},{x:190,y:438,s:.76},{x:1260,y:445,s:.92},{x:1342,y:458,s:1.12},{x:1438,y:438,s:.8}];
const rain=Array.from({length:42},(_,i)=>({x:(i*137)%1600,y:(i*79)%760,l:18+(i%5)*5,o:.13+(i%4)*.035}));

function Tree({x,y,s,p}:{x:number;y:number;s:number;p:Palette}){
  if(p.palms)return <g transform={`translate(${x} ${y}) scale(${s})`} opacity=".92"><path d="M0 92 C8 55 5 27 16 -2" stroke="#513725" strokeWidth="10" strokeLinecap="round" fill="none"/><path d="M16 0 C-25 -8 -45 6 -60 22 C-24 18 -2 14 16 2" fill={p.trees}/><path d="M16 0 C46 -20 72 -15 92 0 C57 1 34 5 17 4" fill={p.trees}/><path d="M16 0 C38 16 47 38 44 58 C28 30 20 16 14 6" fill={p.treesDark}/><path d="M16 0 C-9 19 -22 42 -21 61 C-5 35 7 19 17 7" fill={p.treesDark}/></g>;
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity=".92"><rect x="-8" y="36" width="16" height="78" rx="7" fill="#4a3022"/><circle cx="0" cy="30" r="42" fill={p.treesDark}/><circle cx="-24" cy="40" r="30" fill={p.trees}/><circle cx="26" cy="42" r="32" fill={p.trees}/><circle cx="4" cy="5" r="34" fill={p.trees}/></g>;
}

export function RecipientScene({day,phase,reduceMotion}:{day:RecipientJourneyDay;phase:Phase;reduceMotion:boolean}){
  const p=palettes[day.scene];
  const trainX=phase==="waiting"?-1320:phase==="departing"||phase==="complete"?1420:0;
  return <div className={styles.frame}>
    <svg className={styles.svg} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${day.station}, where the Intezaar mail train delivers today's memory`}>
      <defs>
        <linearGradient id="rrSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={p.skyTop}/><stop offset="100%" stopColor={p.skyBottom}/></linearGradient>
        <linearGradient id="rrTrain" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7b2f28"/><stop offset="55%" stopColor="#5f2521"/><stop offset="100%" stopColor="#351b1a"/></linearGradient>
        <linearGradient id="rrCoach" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#efe3c7"/><stop offset="18%" stopColor="#d9c79f"/><stop offset="19%" stopColor="#78352e"/><stop offset="100%" stopColor="#341b19"/></linearGradient>
        <linearGradient id="rrPlatform" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={p.edge}/><stop offset="14%" stopColor={p.platform}/><stop offset="100%" stopColor="#201612"/></linearGradient>
        <radialGradient id="rrLamp"><stop offset="0%" stopColor={p.light} stopOpacity=".95"/><stop offset="55%" stopColor={p.light} stopOpacity=".22"/><stop offset="100%" stopColor={p.light} stopOpacity="0"/></radialGradient>
        <filter id="rrBlur"><feGaussianBlur stdDeviation="18"/></filter><filter id="rrShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#100807" floodOpacity=".36"/></filter>
      </defs>
      <rect width="1600" height="900" fill="url(#rrSky)"/><circle cx="1245" cy="145" r="115" fill="url(#rrLamp)"/><path d="M0 410 C180 310 365 350 520 286 C680 220 827 338 970 280 C1140 210 1280 330 1600 225 L1600 560 L0 560 Z" fill={p.hills} opacity=".56"/><ellipse cx="795" cy="390" rx="720" ry="110" fill={p.haze} opacity=".12" filter="url(#rrBlur)"/>
      {trees.map((t,i)=><Tree key={i} x={t.x} y={t.y} s={t.s} p={p}/>)}
      <path d="M0 520 C190 470 330 540 505 500 C720 450 890 535 1060 492 C1250 445 1390 518 1600 468 L1600 650 L0 650 Z" fill={p.treesDark} opacity=".9"/>
      <path d="M0 0 H1600 V118 H0 Z" fill="#1c1210" opacity=".82"/><path d="M0 116 H1600 L1518 196 H82 Z" fill="#38251f" opacity=".72"/>
      {[170,460,750,1040,1330].map(x=><g key={x}><rect x={x} y="95" width="18" height="470" fill="#2a1b17" opacity=".86"/><circle cx={x+9} cy="176" r="62" fill="url(#rrLamp)" opacity=".7"/><rect x={x-2} y="172" width="22" height="12" rx="6" fill={p.light} opacity=".88"/></g>)}
      <path d="M0 600 H1600 V900 H0 Z" fill="url(#rrPlatform)"/><rect y="610" width="1600" height="12" fill={p.edge} opacity=".92"/><g opacity=".88"><rect y="745" width="1600" height="7" fill="#231816"/><rect y="797" width="1600" height="7" fill="#231816"/>{Array.from({length:28},(_,i)=><rect key={i} x={i*62-20} y="733" width="34" height="96" rx="3" fill="#694a39"/>)}</g>
      {p.rain?<motion.g animate={{y:reduceMotion?0:[0,38]}} transition={{duration:.7,repeat:Infinity,ease:"linear"}}>{rain.map((d,i)=><line key={i} x1={d.x} y1={d.y} x2={d.x-9} y2={d.y+d.l} stroke="#e6f0ed" strokeWidth="2" opacity={d.o}/>)}</motion.g>:null}
      <motion.g initial={false} animate={{x:trainX}} transition={{duration:reduceMotion?.01:phase==="arriving"?2.25:phase==="departing"?1.9:.45,ease:phase==="arriving"?[.16,1,.3,1]:[.45,0,.55,1]}} filter="url(#rrShadow)">
        <g transform="translate(240 455)"><path d="M0 94 L55 40 H190 L242 95 V214 H0 Z" fill="url(#rrTrain)"/><path d="M45 61 H165 V108 H45 Z" fill="#d8c7a5"/><path d="M54 69 H96 V101 H54 Z M111 69 H154 V101 H111 Z" fill="#33414b"/><rect x="196" y="115" width="28" height="28" rx="14" fill={p.light}/><circle cx="68" cy="220" r="31" fill="#1f1817" stroke="#9b7b66" strokeWidth="8"/><circle cx="188" cy="220" r="31" fill="#1f1817" stroke="#9b7b66" strokeWidth="8"/></g>
        <g transform="translate(492 478)"><rect width="560" height="192" rx="12" fill="url(#rrCoach)"/><rect x="22" y="35" width="516" height="40" rx="7" fill="#31424a"/>{[42,122,202,282,362,442].map(x=><rect key={x} x={x} y="42" width="54" height="26" rx="4" fill="#ddcfa8"/>)}<text x="34" y="112" fill="#f0ddba" fontSize="28" fontWeight="700">भारतीय रेल</text><text x="34" y="146" fill="#e7cda8" fontSize="17" letterSpacing="5">RAILWAY MAIL SERVICE</text><circle cx="105" cy="197" r="29" fill="#1f1817" stroke="#9b7b66" strokeWidth="8"/><circle cx="455" cy="197" r="29" fill="#1f1817" stroke="#9b7b66" strokeWidth="8"/></g>
        <g transform="translate(1064 492)"><rect width="280" height="176" rx="12" fill="url(#rrCoach)"/><rect x="20" y="34" width="240" height="36" rx="7" fill="#31424a"/><text x="28" y="120" fill="#ecd5af" fontSize="18" letterSpacing="4">POST &amp; MEMORIES</text><circle cx="72" cy="181" r="28" fill="#1f1817" stroke="#9b7b66" strokeWidth="8"/><circle cx="218" cy="181" r="28" fill="#1f1817" stroke="#9b7b66" strokeWidth="8"/></g>
      </motion.g>
      <AnimatePresence>{phase==="revealed"?<motion.g initial={{opacity:0,x:55,y:15}} animate={{opacity:1,x:0,y:0}} exit={{opacity:0,x:35}} transition={{duration:.7}} transform="translate(1180 496)"><ellipse cx="42" cy="180" rx="54" ry="13" fill="#180e0c" opacity=".33"/><circle cx="42" cy="25" r="20" fill="#231715"/><path d="M17 48 Q42 35 67 48 L72 126 Q43 144 12 126 Z" fill="#2d201b"/><path d="M17 59 Q8 80 6 111" stroke="#2b1d19" strokeWidth="15" strokeLinecap="round"/><path d="M64 58 Q85 73 100 90" stroke="#2b1d19" strokeWidth="15" strokeLinecap="round"/><rect x="91" y="74" width="72" height="48" rx="5" fill="#f4dfbe" transform="rotate(-5 91 74)"/><path d="M25 124 L20 177 M58 124 L64 177" stroke="#241815" strokeWidth="15" strokeLinecap="round"/></motion.g>:null}</AnimatePresence>
    </svg><div className={styles.shade}/>
  </div>;
}
