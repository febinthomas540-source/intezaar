export type JourneyPalette =
  | "city"
  | "desert"
  | "coast"
  | "monsoon"
  | "arrival";

export type JourneyActivityType =
  | "stamp"
  | "wind"
  | "lamps"
  | "route"
  | "umbrella"
  | "boat";

export type JourneyActivity = {
  type: JourneyActivityType;
  title: string;
  instruction: string;
  reward: string;
};

export type JourneyStage = {
  id: string;
  region: string;
  city: string;
  eyebrow: string;
  title: string;
  description: string;
  temperature: string;
  ambience: string;
  progress: number;
  palette: JourneyPalette;
  stamp: string;
  clue: string;
  postmanLine: string;
  activity: JourneyActivity;
};

export const demoJourney: JourneyStage[] = [
  {
    id: "delhi",
    region: "Delhi",
    city: "New Delhi",
    eyebrow: "Day 1 · Departed",
    title: "Your words have left the city.",
    description:
      "Stamped beneath the evening lights, the letter has begun its long journey south.",
    temperature: "31°C",
    ambience: "Warm evening · distant railway",
    progress: 8,
    palette: "city",
    stamp: "DEL",
    clue: "The sender chose midnight for a reason.",
    postmanLine:
      "Namaste. I am Arin, your postman for this journey. The letter is sealed, counted and safely inside my bag.",
    activity: {
      type: "stamp",
      title: "Approve the departure",
      instruction: "Press the Delhi postmark onto the travel passport.",
      reward: "Delhi departure stamp",
    },
  },
  {
    id: "agra",
    region: "Uttar Pradesh",
    city: "Agra",
    eyebrow: "Day 2 · Morning rail",
    title: "A pale sunrise over old stone.",
    description:
      "The overnight train has carried the letter past sleeping towns and into the first light.",
    temperature: "30°C",
    ambience: "Railway rhythm · morning birds",
    progress: 17,
    palette: "city",
    stamp: "AGR",
    clue: "A tiny heart is drawn beneath the flap.",
    postmanLine:
      "We reached Agra before breakfast. I saw something drawn under the flap, but a good postman never tells everything.",
    activity: {
      type: "lamps",
      title: "Wake the station",
      instruction: "Light all three platform lamps so the mail train can leave.",
      reward: "First-light stamp",
    },
  },
  {
    id: "jaipur",
    region: "Rajasthan",
    city: "Jaipur",
    eyebrow: "Day 3 · Desert edge",
    title: "The air has turned golden.",
    description:
      "Pink walls fade behind us while desert wind begins to test the wax seal.",
    temperature: "38°C",
    ambience: "Dry wind · bicycle bell",
    progress: 28,
    palette: "desert",
    stamp: "JAI",
    clue: "The paper carries a trace of perfume.",
    postmanLine:
      "The Rajasthan wind is playful today. Help me keep hold of the envelope and I will protect the words inside.",
    activity: {
      type: "wind",
      title: "Catch the letter",
      instruction: "Tap the drifting envelope three times before the wind takes it.",
      reward: "Desert guardian stamp",
    },
  },
  {
    id: "udaipur",
    region: "Rajasthan",
    city: "Udaipur",
    eyebrow: "Day 4 · Lake road",
    title: "A quieter road beside the water.",
    description:
      "The route bends around silver lakes. For a little while, even the letter seems to rest.",
    temperature: "34°C",
    ambience: "Lake breeze · distant bells",
    progress: 38,
    palette: "desert",
    stamp: "UDR",
    clue: "One sentence begins with ‘Do you remember…’",
    postmanLine:
      "Two roads leave Udaipur. Neither changes the promised arrival, but you may choose how the story continues.",
    activity: {
      type: "route",
      title: "Choose tonight’s road",
      instruction: "Choose the moonlit lake road or the old postal highway.",
      reward: "Wayfinder stamp",
    },
  },
  {
    id: "mumbai",
    region: "Maharashtra",
    city: "Mumbai",
    eyebrow: "Day 5 · Monsoon city",
    title: "Rain against the railway windows.",
    description:
      "The letter has entered Mumbai beneath a sudden shower and a thousand reflected lights.",
    temperature: "28°C",
    ambience: "City rain · local train",
    progress: 49,
    palette: "coast",
    stamp: "BOM",
    clue: "The sender recorded a voice note for the final page.",
    postmanLine:
      "Mumbai has welcomed us with rain. Hold the umbrella steady while I move the letter to the coastal mail coach.",
    activity: {
      type: "umbrella",
      title: "Shelter the envelope",
      instruction: "Hold the umbrella until the letter is safely covered.",
      reward: "Monsoon keeper stamp",
    },
  },
  {
    id: "goa",
    region: "Goa",
    city: "Panaji",
    eyebrow: "Day 6 · Coastal turn",
    title: "Salt has entered the air.",
    description:
      "Sea breeze follows the route now. The paper is dry, the seal unbroken, the secret getting closer.",
    temperature: "29°C",
    ambience: "Sea wind · church bells",
    progress: 60,
    palette: "coast",
    stamp: "GOA",
    clue: "There is a photograph hidden behind the letter.",
    postmanLine:
      "We are close enough to hear the sea. Stamp the passport and I will place the envelope in the southbound bag.",
    activity: {
      type: "stamp",
      title: "Mark the coastal crossing",
      instruction: "Press the Goa postmark into the journey passport.",
      reward: "Coastal crossing stamp",
    },
  },
  {
    id: "mangaluru",
    region: "Karnataka",
    city: "Mangaluru",
    eyebrow: "Day 7 · Harbour mail",
    title: "Following the edge of the Arabian Sea.",
    description:
      "Fishing boats return as the post bag changes hands at the harbour.",
    temperature: "28°C",
    ambience: "Harbour water · gulls",
    progress: 70,
    palette: "coast",
    stamp: "IXE",
    clue: "The final word of the letter is your nickname.",
    postmanLine:
      "The harbour is busy. Guide our little mail boat through the water and we will reach the hill road before dark.",
    activity: {
      type: "boat",
      title: "Guide the mail boat",
      instruction: "Tap the boat three times to carry the post bag across the harbour.",
      reward: "Harbour pilot stamp",
    },
  },
  {
    id: "ghats",
    region: "Western Ghats",
    city: "The mountain road",
    eyebrow: "Day 8 · Almost there",
    title: "Through the monsoon hills.",
    description:
      "Clouds gather over green ridges. Tiny drops touch the bag, but not the secret inside.",
    temperature: "23°C",
    ambience: "Rainfall · forest birds",
    progress: 81,
    palette: "monsoon",
    stamp: "GHT",
    clue: "The sender rewrote the opening line four times.",
    postmanLine:
      "The road is dark beneath the trees. Light the way for us and I promise the letter will not miss its moment.",
    activity: {
      type: "lamps",
      title: "Light the hill road",
      instruction: "Light all three lanterns to guide the postman through the mist.",
      reward: "Hill-road lantern stamp",
    },
  },
  {
    id: "kochi",
    region: "Kerala",
    city: "Kochi",
    eyebrow: "Day 9 · In your state",
    title: "The journey has entered Kerala.",
    description:
      "Rain-soft streets, ferry horns and palms. The destination is now only one chapter away.",
    temperature: "27°C",
    ambience: "Ferry horn · soft rain",
    progress: 91,
    palette: "monsoon",
    stamp: "COK",
    clue: "The letter begins with ‘I wanted this to feel different.’",
    postmanLine:
      "We have reached Kerala. One final crossing remains. Choose the quieter backwater route or the faster main road.",
    activity: {
      type: "route",
      title: "Choose the final approach",
      instruction: "Choose how the letter should travel through its last evening.",
      reward: "Kerala arrival stamp",
    },
  },
  {
    id: "alappuzha",
    region: "Kerala",
    city: "Alappuzha",
    eyebrow: "Day 10 · Arrived",
    title: "It has reached you.",
    description:
      "The letter rests beside the backwaters, waiting for the exact minute chosen by its sender.",
    temperature: "27°C",
    ambience: "Water · palms · evening rain",
    progress: 100,
    palette: "arrival",
    stamp: "ARR",
    clue: "No more clues. The seal will tell you everything.",
    postmanLine:
      "My part of the journey is complete. When the clock reaches the promised moment, the seal belongs to you.",
    activity: {
      type: "stamp",
      title: "Accept the delivery",
      instruction: "Place the final arrival stamp into the passport.",
      reward: "Delivered with care stamp",
    },
  },
];
