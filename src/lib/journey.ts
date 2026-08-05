export type JourneyPalette =
  | "city"
  | "desert"
  | "coast"
  | "monsoon"
  | "arrival";

export type JourneyRitualType = "stamp" | "umbrella" | "receive";

export type JourneyRitual = {
  type: JourneyRitualType;
  title: string;
  instruction: string;
  completion: string;
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
  trace: string;
  postmanLine: string;
  postcardTitle: string;
  postcardBody: string;
  keepsakeName: string;
  keepsakeDetail: string;
  memoryPrompt: string;
  ritual?: JourneyRitual;
};

export const demoJourney: JourneyStage[] = [
  {
    id: "delhi",
    region: "Delhi",
    city: "New Delhi",
    eyebrow: "Evening one · Departed",
    title: "Your words have left the city.",
    description:
      "Stamped beneath the evening lights, the letter has begun its long journey south. Somewhere behind it, an ordinary day has become a memory worth sending.",
    temperature: "31°C",
    ambience: "Warm evening · distant railway",
    progress: 8,
    palette: "city",
    stamp: "DEL",
    trace: "The sender chose midnight because that is when you used to talk the longest.",
    postmanLine:
      "I have carried thousands of letters. The important ones are never the heaviest; they are the ones people hesitate before letting go.",
    postcardTitle: "A note from the platform",
    postcardBody:
      "The train pulled away slowly. For a moment, the city lights looked like all the messages someone nearly sent and then deleted.",
    keepsakeName: "A handwritten date",
    keepsakeDetail: "04 · 08 · 2020, written twice and underlined once.",
    memoryPrompt: "What was the first ordinary moment with them that became special later?",
    ritual: {
      type: "stamp",
      title: "Begin the journey",
      instruction: "Place the first postmark on the envelope. Nothing else is required from you.",
      completion: "The departure has been remembered.",
    },
  },
  {
    id: "agra",
    region: "Uttar Pradesh",
    city: "Agra",
    eyebrow: "Morning two · First light",
    title: "A pale sunrise over old stone.",
    description:
      "The overnight train passes sleeping towns. The envelope rests by the window while the first light touches the handwriting inside.",
    temperature: "30°C",
    ambience: "Railway rhythm · morning birds",
    progress: 17,
    palette: "city",
    stamp: "AGR",
    trace: "A tiny heart is drawn beneath the flap where nobody was meant to see it.",
    postmanLine:
      "People remember grand days, but letters usually carry smaller things: one cup of tea, one missed bus, one look across a room.",
    postcardTitle: "Before the city woke",
    postcardBody:
      "A tea seller called into the quiet platform. The smell followed us for a while, like a morning from another year.",
    keepsakeName: "A tea-stained corner",
    keepsakeDetail: "The faint ring of a cup from the night the letter was written.",
    memoryPrompt: "Which small habit of theirs would you recognise anywhere?",
  },
  {
    id: "jaipur",
    region: "Rajasthan",
    city: "Jaipur",
    eyebrow: "Afternoon three · Golden air",
    title: "The air has turned golden.",
    description:
      "Pink walls fade behind us and desert wind moves across the paper. The seal stays closed, but the past is beginning to show through.",
    temperature: "38°C",
    ambience: "Dry wind · bicycle bell",
    progress: 28,
    palette: "desert",
    stamp: "JAI",
    trace: "The paper carries the faint perfume they wore the first time you met.",
    postmanLine:
      "A scent can cross years faster than any train. Sometimes one breath is enough to return to a place that no longer exists.",
    postcardTitle: "Heat on the old postal road",
    postcardBody:
      "The wind lifted dust around the van. I held the letter closer, and for a second the perfume inside escaped into the afternoon.",
    keepsakeName: "A familiar scent",
    keepsakeDetail: "Not enough to name, only enough to remember.",
    memoryPrompt: "What smell, song or place takes you back to them immediately?",
  },
  {
    id: "udaipur",
    region: "Rajasthan",
    city: "Udaipur",
    eyebrow: "Evening four · Lake road",
    title: "A quieter road beside the water.",
    description:
      "The route bends around silver lakes. Nothing needs to be solved here. The letter simply rests while an old memory rises to the surface.",
    temperature: "34°C",
    ambience: "Lake breeze · distant bells",
    progress: 38,
    palette: "desert",
    stamp: "UDR",
    trace: "One sentence begins: ‘Do you remember the day we had nowhere to be?’",
    postmanLine:
      "The best memories often have no photograph. Only two people know they happened, and that is what makes them precious.",
    postcardTitle: "The road that asked us to slow down",
    postcardBody:
      "The lake held the last light. Even the driver stopped talking. Some places make silence feel like company.",
    keepsakeName: "An unfinished sentence",
    keepsakeDetail: "‘Do you remember…’ followed by a line crossed out gently.",
    memoryPrompt: "Which day with them felt unimportant then, but means everything now?",
  },
  {
    id: "mumbai",
    region: "Maharashtra",
    city: "Mumbai",
    eyebrow: "Night five · Monsoon city",
    title: "Rain against the railway windows.",
    description:
      "The letter enters Mumbai beneath a sudden shower and a thousand reflected lights. The city sounds like an old voice note played from another room.",
    temperature: "28°C",
    ambience: "City rain · local train",
    progress: 49,
    palette: "coast",
    stamp: "BOM",
    trace: "A voice note is waiting behind the final page. It starts with a nervous laugh.",
    postmanLine:
      "Rain changes every city into memory. Hold the umbrella for a moment; after that, let me carry the responsibility.",
    postcardTitle: "Rain at the red signal",
    postcardBody:
      "We waited beneath a bridge while scooters gathered around us. Somewhere nearby, a song from an old film played through a small radio.",
    keepsakeName: "Seven seconds of a voice",
    keepsakeDetail: "A breath, a laugh, and the beginning of your name.",
    memoryPrompt: "What would you want to hear them say exactly as they used to say it?",
    ritual: {
      type: "umbrella",
      title: "Keep one memory dry",
      instruction: "Hold the umbrella over the envelope for a quiet second.",
      completion: "The rain passed without touching the words.",
    },
  },
  {
    id: "goa",
    region: "Goa",
    city: "Panaji",
    eyebrow: "Morning six · Coastal turn",
    title: "Salt has entered the air.",
    description:
      "Sea breeze follows the route now. A photograph hidden behind the letter begins to reveal one soft, sun-faded corner.",
    temperature: "29°C",
    ambience: "Sea wind · church bells",
    progress: 60,
    palette: "coast",
    stamp: "GOA",
    trace: "The photograph was taken on a day neither of you dressed for the camera.",
    postmanLine:
      "Perfect pictures are easy to keep. The blurry ones are harder to throw away because they usually contain the real day.",
    postcardTitle: "A blue morning near the sea",
    postcardBody:
      "The post bag smelled faintly of salt. A corner of the photograph caught the light, but I turned it back before I saw too much.",
    keepsakeName: "A sun-faded photograph",
    keepsakeDetail: "Only one corner is visible: two hands and an old plastic chair.",
    memoryPrompt: "Which imperfect photograph of both of you would you never delete?",
  },
  {
    id: "mangaluru",
    region: "Karnataka",
    city: "Mangaluru",
    eyebrow: "Afternoon seven · Harbour mail",
    title: "Following the edge of the Arabian Sea.",
    description:
      "Fishing boats return as the post bag changes hands. The letter has travelled far enough that the destination now feels like a promise.",
    temperature: "28°C",
    ambience: "Harbour water · gulls",
    progress: 70,
    palette: "coast",
    stamp: "IXE",
    trace: "The final word of the letter is the nickname only the sender uses for you.",
    postmanLine:
      "Nicknames are small homes. A person can hear one word and know exactly who is calling them back.",
    postcardTitle: "Between the boats and the rain",
    postcardBody:
      "A fisherman waved as we crossed the harbour. He did not know what I carried, only that I was careful with it.",
    keepsakeName: "A private name",
    keepsakeDetail: "The last word remains hidden, but its first letter has appeared.",
    memoryPrompt: "Which name, joke or phrase belongs only to the two of you?",
  },
  {
    id: "ghats",
    region: "Western Ghats",
    city: "The mountain road",
    eyebrow: "Evening eight · Almost there",
    title: "Through the monsoon hills.",
    description:
      "Clouds gather over green ridges. The postman says little now. Near the end of a journey, even excitement can feel like homesickness.",
    temperature: "23°C",
    ambience: "Rainfall · forest birds",
    progress: 81,
    palette: "monsoon",
    stamp: "GHT",
    trace: "The sender rewrote the opening line four times and kept the least polished one.",
    postmanLine:
      "Some words are beautiful because they are imperfect. You can see where the person stopped, breathed, and tried again.",
    postcardTitle: "Mist on the hill road",
    postcardBody:
      "The trees disappeared and returned inside the fog. I thought of all the people who leave, and all the small ways they try to remain.",
    keepsakeName: "Four abandoned openings",
    keepsakeDetail: "Crossed-out beginnings still visible beneath the final line.",
    memoryPrompt: "What have you always wanted to tell them without making it sound perfect?",
  },
  {
    id: "kochi",
    region: "Kerala",
    city: "Kochi",
    eyebrow: "Night nine · In your state",
    title: "The journey has entered Kerala.",
    description:
      "Rain-soft streets, ferry horns and palms. The destination is close enough for the letter to feel less like an object and more like someone arriving.",
    temperature: "27°C",
    ambience: "Ferry horn · soft rain",
    progress: 91,
    palette: "monsoon",
    stamp: "COK",
    trace: "The letter begins: ‘I wanted this to feel like finding something we had lost.’",
    postmanLine:
      "Tomorrow I will knock only once. Tonight, you are allowed to wonder what part of your past has travelled all this way to find you.",
    postcardTitle: "The last ferry home",
    postcardBody:
      "Lights moved across the water like old messages loading on a screen. The letter stayed quiet in my bag, almost home.",
    keepsakeName: "The first complete line",
    keepsakeDetail: "‘I wanted this to feel like finding something we had lost.’",
    memoryPrompt: "What part of your relationship would you bring back for one evening?",
  },
  {
    id: "alappuzha",
    region: "Kerala",
    city: "Alappuzha",
    eyebrow: "Arrival ten · Waiting for midnight",
    title: "It has reached you.",
    description:
      "The letter rests beside the backwaters, waiting for the exact minute chosen by its sender. The journey is over, but the memory has only just arrived.",
    temperature: "27°C",
    ambience: "Water · palms · evening rain",
    progress: 100,
    palette: "arrival",
    stamp: "ARR",
    trace: "No more clues. The seal will tell you what the sender could not say in an ordinary message.",
    postmanLine:
      "My part is complete. Keep the postcards, the traces and the memories you wrote. They belong to this letter now—and to you.",
    postcardTitle: "Delivered beside the water",
    postcardBody:
      "The rain softened before midnight. I placed the envelope down carefully and left before the moment became mine instead of yours.",
    keepsakeName: "The unopened letter",
    keepsakeDetail: "Warm wax, your name, and the exact minute it may be opened.",
    memoryPrompt: "Before you open it: what do you hope this letter remembers about you?",
    ritual: {
      type: "receive",
      title: "Receive the letter",
      instruction: "Touch the final postmark when you are ready to let the journey end.",
      completion: "Delivered with care. The seal is waiting for midnight.",
    },
  },
];
