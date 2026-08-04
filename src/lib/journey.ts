export type JourneyStage = {
  id: string;
  region: string;
  eyebrow: string;
  title: string;
  description: string;
  temperature: string;
  ambience: string;
  progress: number;
  palette: "city" | "desert" | "coast" | "monsoon" | "arrival";
};

export const demoJourney: JourneyStage[] = [
  {
    id: "delhi",
    region: "Delhi",
    eyebrow: "Day 1 · Departed",
    title: "Your words have left the city.",
    description:
      "Stamped beneath the evening lights, the letter has begun its long journey south.",
    temperature: "31°C",
    ambience: "Warm evening · distant railway",
    progress: 12,
    palette: "city",
  },
  {
    id: "rajasthan",
    region: "Rajasthan",
    eyebrow: "Day 2 · In transit",
    title: "Crossing the golden silence.",
    description:
      "Desert wind moves over the envelope. The seal is warm, but every word remains safe.",
    temperature: "39°C",
    ambience: "Dry wind · soft sand",
    progress: 36,
    palette: "desert",
  },
  {
    id: "coast",
    region: "Konkan Coast",
    eyebrow: "Day 3 · Turning toward the sea",
    title: "The air has changed.",
    description:
      "Salt, rain and railway windows. Your letter is following the coast toward home.",
    temperature: "29°C",
    ambience: "Sea breeze · distant rain",
    progress: 61,
    palette: "coast",
  },
  {
    id: "ghats",
    region: "Western Ghats",
    eyebrow: "Day 4 · Almost there",
    title: "Through the monsoon hills.",
    description:
      "Clouds gather over green ridges. Tiny drops have touched the paper, but not the secret inside.",
    temperature: "23°C",
    ambience: "Rainfall · forest birds",
    progress: 83,
    palette: "monsoon",
  },
  {
    id: "kerala",
    region: "Kerala",
    eyebrow: "Day 5 · Arrived",
    title: "The journey is over.",
    description:
      "The letter has reached the backwaters. It is waiting for the exact moment chosen for you.",
    temperature: "27°C",
    ambience: "Soft rain · water and palms",
    progress: 100,
    palette: "arrival",
  },
];
