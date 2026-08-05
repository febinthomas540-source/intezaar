export type RecipientJourneyDay = {
  day: number;
  station: string;
  routeLabel: string;
  time: string;
  weather: string;
  scene: "delhi" | "jaipur" | "konkan" | "kottayam" | "alappuzha";
  artifactLabel: string;
  artifactType: "dispatch" | "postcard" | "voice" | "ticket" | "letter";
  memory: string;
  detail: string;
  postmanLine: string;
  final?: boolean;
};

export const recipientJourneyDays: RecipientJourneyDay[] = [
  {
    day: 1,
    station: "New Delhi Sorting Office",
    routeLabel: "Delhi · Platform 4",
    time: "8:42 PM",
    weather: "Warm dusk",
    scene: "delhi",
    artifactLabel: "FIRST DISPATCH",
    artifactType: "dispatch",
    memory: "A letter has begun travelling to you.",
    detail: "The sender remembered rain at a bus stop.",
    postmanLine: "Only one trace today. The rest must travel.",
  },
  {
    day: 2,
    station: "Jaipur Junction",
    routeLabel: "Rajasthan Mail Exchange",
    time: "7:18 PM",
    weather: "Amber evening",
    scene: "jaipur",
    artifactLabel: "POSTCARD 02",
    artifactType: "postcard",
    memory: "Every journey felt shorter when someone waited at the end.",
    detail: "A sentence copied from an old notebook.",
    postmanLine: "This survived the desert wind for you.",
  },
  {
    day: 3,
    station: "Konkan Coastal Line",
    routeLabel: "Ratnagiri · Rain halt",
    time: "6:06 PM",
    weather: "Heavy monsoon",
    scene: "konkan",
    artifactLabel: "VOICE TRACE · 00:07",
    artifactType: "voice",
    memory: "Seven seconds of rain, a station announcement, and familiar laughter.",
    detail: "The voice remains partly hidden until the letter arrives.",
    postmanLine: "Listen once. The train cannot wait long.",
  },
  {
    day: 4,
    station: "Kottayam Night Mail",
    routeLabel: "Kerala · Southbound",
    time: "9:24 PM",
    weather: "Rain after dark",
    scene: "kottayam",
    artifactLabel: "OLD BUS TICKET",
    artifactType: "ticket",
    memory: "Two teas. One missed bus. No hurry to go home.",
    detail: "A small ordinary evening the sender never forgot.",
    postmanLine: "Tomorrow, I carry the real envelope.",
  },
  {
    day: 5,
    station: "Alappuzha Arrival",
    routeLabel: "Final delivery platform",
    time: "8:00 PM",
    weather: "Quiet after rain",
    scene: "alappuzha",
    artifactLabel: "SEALED LETTER",
    artifactType: "letter",
    memory: "The journey is over. The letter is yours.",
    detail: "Every station, postmark, and memory travelled with it.",
    postmanLine: "I have nothing left to hide from you.",
    final: true,
  },
];
