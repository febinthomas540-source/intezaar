"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { recipientJourneyDays, type RecipientJourneyDay } from "@/lib/recipient-journey";
import { RecipientScene } from "./recipient-scene";
import styles from "./recipient-demo.module.css";

type Props={recipient:string};
type Phase="notification"|"waiting"|"arriving"|"revealed"|"departing"|"complete"|"opened";

function playTrainCue(){
  if(typeof window==="undefined"||!window.AudioContext)return;
  const context=new AudioContext();const gain=context.createGain();const now=context.currentTime;
  gain.connect(context.destination);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.055,now+.03);gain.gain.exponentialRampToValueAtTime(.0001,now+1.2);
  const whistle=context.createOscillator();whistle.type="sine";whistle.frequency.setValueAtTime(310,now);whistle.frequency.exponentialRampToValueAtTime(185,now+1.05);whistle.connect(gain);whistle.start(now);whistle.stop(now+1.16);
  window.setTimeout(()=>void context.close(),1400);
}

function Artifact({day}:{day:RecipientJourneyDay}){
  const dynamic=styles[`artifact${day.artifactType[0].toUpperCase()}${day.artifactType.slice(1)}`];
  return <div className={`${styles.artifact} ${dynamic}`}>
    <small>{day.artifactLabel}</small>
    {day.artifactType==="voice"?<div className={styles.waveform}>{[18,35,24,52,31,61,27,43,20,48,29,57].map((h,i)=><i key={i} style={{height:h}}/>)}</div>:null}
    {day.artifactType==="letter"?<div className={styles.miniEnvelope}><span>I</span></div>:null}
    <strong>{day.detail}</strong>
  </div>;
}

export function RecipientDemo({recipient}:Props){
  const [dayIndex,setDayIndex]=useState(0);const [phase,setPhase]=useState<Phase>("notification");const reduceMotion=Boolean(useReducedMotion());
  const day=recipientJourneyDays[dayIndex];
  useEffect(()=>{let timer:ReturnType<typeof setTimeout>|undefined;if(phase==="arriving")timer=setTimeout(()=>setPhase("revealed"),reduceMotion?80:2400);else if(phase==="departing")timer=setTimeout(()=>setPhase("complete"),reduceMotion?80:1950);return()=>{if(timer)clearTimeout(timer)}},[phase,reduceMotion]);
  const progress=useMemo(()=>((dayIndex+1)/recipientJourneyDays.length)*100,[dayIndex]);
  const arrive=()=>{playTrainCue();setPhase("arriving")};
  const chooseDay=(index:number)=>{setDayIndex(index);setPhase("waiting")};
  const keepMemory=()=>day.final?setPhase("opened"):setPhase("departing");

  return <main className={styles.shell}>
    <header className={styles.header}><Link href="/" className={styles.brand}><span>I</span><strong>Intezaar</strong></Link><small>Recipient preview</small></header>
    <AnimatePresence mode="wait">
      {phase==="notification"?<motion.section key="notification" className={styles.notificationScene} initial={reduceMotion?false:{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={reduceMotion?undefined:{opacity:0,y:-14}}>
        <div className={styles.phone}><div className={styles.phoneStatus}><span>8:42</span><i/></div><div className={styles.notificationHeading}>Private delivery</div>
          <motion.div className={styles.notificationCard} initial={reduceMotion?false:{opacity:0,scale:.96,y:14}} animate={{opacity:1,scale:1,y:0}} transition={{delay:.18,duration:.52}}>
            <div className={styles.notificationSender}><span>I</span><div><strong>Intezaar</strong><small>now</small></div></div>
            <p><strong>{recipient},</strong> a letter has started travelling to you.</p><p>Today&apos;s mail train is waiting at Delhi.</p><button onClick={()=>setPhase("waiting")}>Open private delivery</button>
          </motion.div><small className={styles.phoneNote}>This is the first notification the recipient receives.</small></div>
      </motion.section>:<motion.section key="journey" className={styles.journey} initial={reduceMotion?false:{opacity:0}} animate={{opacity:1}}>
        <div className={styles.previewControls}><div><span>Preview only</span><strong>Jump between recipient days</strong></div><div className={styles.dayButtons}>{recipientJourneyDays.map((item,index)=><button key={item.day} className={index===dayIndex?styles.dayActive:""} onClick={()=>chooseDay(index)}>{item.final?"Final":`Day ${item.day}`}</button>)}</div></div>
        <div className={styles.intro}><div><p>Private delivery for {recipient}</p><h1>A train stops.<br/><em>One memory steps out.</em></h1><span>{day.memory}</span></div><div className={styles.daySeal}><span>DAY</span><strong>{String(day.day).padStart(2,"0")}</strong><small>OF {recipientJourneyDays.length}</small></div></div>
        <div className={styles.routeBar}><div><span>{day.station}</span><strong>{day.routeLabel}</strong></div><div className={styles.routeTrack}><i style={{width:`${progress}%`}}/></div><small>{day.time} · {day.weather}</small></div>
        {phase==="opened"?<motion.article className={styles.openedLetter} initial={reduceMotion?false:{opacity:0,y:24,rotateX:8}} animate={{opacity:1,y:0,rotateX:0}}><small>Delhi · five stations · Alappuzha</small><h2>Dear {recipient},</h2><p>Do you remember the evening we missed the bus and laughed beneath that broken shop awning?</p><p>I could have sent this in a second. I wanted every station to carry a piece of it first.</p><p>Some memories do not belong to speed. They belong to waiting.</p><p className={styles.signoff}>Still remembering,<br/>Arjun</p><button onClick={()=>setPhase("waiting")}>Watch the final arrival again</button></motion.article>:
        phase==="complete"?<motion.article className={styles.completeState} initial={reduceMotion?false:{opacity:0,scale:.985}} animate={{opacity:1,scale:1}}><span>Today&apos;s delivery is complete</span><h2>The train has left {day.station}.</h2><p>The next station stays blurred until tomorrow.</p><div className={styles.completeActions}><button onClick={arrive}>Replay today</button>{dayIndex<recipientJourneyDays.length-1?<button onClick={()=>chooseDay(dayIndex+1)}>Preview next day</button>:null}</div></motion.article>:
        <div className={styles.sceneFrame}><RecipientScene day={day} phase={phase} reduceMotion={reduceMotion}/>
          {phase==="waiting"?<motion.div className={styles.lockedPrompt} initial={reduceMotion?false:{opacity:0,y:18}} animate={{opacity:1,y:0}}><span>Today&apos;s station is ready</span><h2>The rest of the journey remains blurred.</h2><p>Let the train arrive and reveal only what belongs to today.</p><button onClick={arrive}>Let today&apos;s train arrive</button></motion.div>:null}
          {phase==="arriving"?<div className={styles.arrivalCaption}>Intezaar Mail is entering {day.station}</div>:null}
          {phase==="revealed"?<motion.div className={styles.reveal} initial={reduceMotion?false:{opacity:0,y:22}} animate={{opacity:1,y:0}}><div className={styles.revealCopy}><span>The postman says</span><h2>“{day.postmanLine}”</h2><p>{day.memory}</p></div><Artifact day={day}/><button className={styles.keepButton} onClick={keepMemory}>{day.final?"Receive and open the letter":"Keep today’s memory"}</button></motion.div>:null}
        </div>}
        <div className={styles.journeyStrip}>{recipientJourneyDays.map((item,index)=>{const future=index>dayIndex;const current=index===dayIndex;return <div key={item.day} className={`${styles.stripStop} ${current?styles.stripCurrent:""} ${future?styles.stripFuture:""}`}><span>{String(item.day).padStart(2,"0")}</span><strong>{item.station}</strong></div>})}</div>
        <p className={styles.previewNote}>Preview controls disappear from a real recipient link. Only the currently unlocked station is visible.</p>
      </motion.section>}
    </AnimatePresence>
  </main>;
}
