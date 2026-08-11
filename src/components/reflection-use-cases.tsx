import Link from "next/link";
import styles from "./reflection-use-cases.module.css";

const paths = [
  {
    href: "/future-self",
    eyebrow: "For yourself",
    title: "A letter to your future self",
    copy: "Write what matters today and leave it sealed for the person you will be later.",
    action: "Write to future me",
  },
  {
    href: "/open-when",
    eyebrow: "For someone you care about",
    title: "Open when…",
    copy: "Create a letter for a particular moment: when they miss you, need courage, or reach something worth celebrating.",
    action: "Explore open-when letters",
  },
  {
    href: "/unsent-letter",
    eyebrow: "For words you are not ready to send",
    title: "Write it before you decide",
    copy: "Put the words somewhere private first. You can decide later whether they should ever be posted.",
    action: "Write an unsent letter",
  },
  {
    href: "/write-after-argument",
    eyebrow: "For heated moments",
    title: "Write now. Send later.",
    copy: "Give yourself distance between the feeling and the sending. Write the letter, then choose a later moment.",
    action: "See the slower way",
  },
];

export function ReflectionUseCases() {
  return (
    <section className={styles.section} aria-labelledby="letters-for-later-title">
      <header className={styles.heading}>
        <p>Letters that are meant to wait</p>
        <h2 id="letters-for-later-title">For someone you love. For your future self. For a moment that has not happened yet.</h2>
        <span>Intezaar keeps one thing at the centre: a private letter with time around it.</span>
      </header>

      <div className={styles.grid}>
        {paths.map((path) => (
          <Link href={path.href} className={styles.card} key={path.href}>
            <small>{path.eyebrow}</small>
            <h3>{path.title}</h3>
            <p>{path.copy}</p>
            <strong>{path.action} <span aria-hidden="true">→</span></strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
