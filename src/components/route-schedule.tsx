"use client";

import { motion } from "motion/react";
import styles from "./route-schedule.module.css";

const stops = [
  ["01", "New Delhi", "Departed · Evening", "Rail"],
  ["02", "Mathura", "Night crossing", "Rail"],
  ["03", "Agra", "First light", "Rail"],
  ["04", "Jaipur", "Golden afternoon", "Road"],
  ["05", "Ajmer", "Dusk post exchange", "Road"],
  ["06", "Udaipur", "Lake-side evening", "Road"],
  ["07", "Ahmedabad", "Midnight sorting office", "Rail"],
  ["08", "Vadodara", "Early morning platform", "Rail"],
  ["09", "Mumbai", "Monsoon night", "Rail"],
  ["10", "Pune", "Hill-bound morning", "Rail"],
  ["11", "Goa", "Coastal afternoon", "Rail"],
  ["12", "Karwar", "Sea-side dusk", "Rail"],
  ["13", "Mangaluru", "Harbour morning", "Rail"],
  ["14", "Kozhikode", "Rain-soft evening", "Rail"],
  ["15", "Thrissur", "Festival-light night", "Rail"],
  ["16", "Kochi", "Ferry-hour morning", "Boat"],
  ["17", "Kottayam", "Backwater afternoon", "Road"],
  ["18", "Alappuzha", "Arrives at midnight", "Boat"],
];

export function RouteSchedule() {
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <div>
          <p>THE LONG WAY HOME</p>
          <h2>Eighteen stops. One letter still moving.</h2>
        </div>
        <p className={styles.intro}>The detailed story changes at major chapters, while the live route keeps passing through real Indian cities, stations, coastlines and postal exchanges.</p>
      </div>

      <div className={styles.trainScene} aria-hidden="true">
        <div className={styles.sky}><span /><i /></div>
        <div className={styles.signal}><b /><em /><small /></div>
        <div className={styles.platform}><span>INTEZAAR MAIL</span></div>
        <motion.div
          className={styles.train}
          initial={{ x: "-35%" }}
          animate={{ x: ["-35%", "118%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          <div className={styles.engine}><span>भारतीय रेल</span><strong>INTEZAAR MAIL</strong><i /><i /><b /><b /></div>
          {[1, 2, 3].map((coach) => (
            <div className={styles.coach} key={coach}><span>POST &amp; MEMORIES</span><i /><i /><i /><b /><b /></div>
          ))}
        </motion.div>
        <div className={styles.track}><i /><i /></div>
      </div>

      <div className={styles.schedule}>
        {stops.map(([number, city, timing, mode], index) => (
          <article key={city} className={index === 0 ? styles.current : index === stops.length - 1 ? styles.arrival : ""}>
            <span className={styles.number}>{number}</span>
            <div><strong>{city}</strong><small>{timing}</small></div>
            <em>{mode}</em>
          </article>
        ))}
      </div>
    </section>
  );
}
