export type RouteCorridor = {
  id: string;
  name: string;
  strapline: string;
  origin: string;
  destination: string;
  duration: string;
  tone: string;
  transport: string;
  stops: string[];
  accent: string;
};

export const routeCorridors: RouteCorridor[] = [
  {
    id: "grand-trunk-homecoming",
    name: "The Long Way Home",
    strapline: "Delhi rooftops to the Kerala backwaters",
    origin: "Delhi",
    destination: "Alappuzha",
    duration: "5 daily landings",
    tone: "North to south · expansive and warm",
    transport: "Terraces · river plains · coastal wind",
    stops: ["Delhi", "Agra", "Jaipur", "Ahmedabad", "Mumbai", "Goa", "Mangaluru", "Kozhikode", "Kottayam", "Alappuzha"],
    accent: "LH",
  },
  {
    id: "konkan-rain-letter",
    name: "The Konkan Monsoon Flight",
    strapline: "Rain clouds, red roofs and the Arabian Sea",
    origin: "Mumbai",
    destination: "Kochi",
    duration: "5 daily landings",
    tone: "West coast · rain and sea air",
    transport: "Harbour roofs · palms · monsoon trees",
    stops: ["Mumbai", "Ratnagiri", "Goa", "Karwar", "Mangaluru", "Kozhikode", "Thrissur", "Kochi"],
    accent: "KM",
  },
  {
    id: "coromandel-post",
    name: "The Coromandel Sea-Breeze Flight",
    strapline: "Howrah mornings to a warm Chennai window",
    origin: "Kolkata",
    destination: "Chennai",
    duration: "5 daily landings",
    tone: "East coast · literary and bright",
    transport: "Clock towers · temple towns · salt air",
    stops: ["Kolkata", "Kharagpur", "Bhubaneswar", "Puri", "Visakhapatnam", "Vijayawada", "Nellore", "Chennai"],
    accent: "CS",
  },
  {
    id: "himalayan-blue-mail",
    name: "The Himalayan Blue Wing",
    strapline: "Plains, pine mist and a quiet mountain window",
    origin: "Delhi",
    destination: "Shimla",
    duration: "3 daily landings",
    tone: "Mountain · winter and stillness",
    transport: "Cold rooftops · cedar branches · blue dusk",
    stops: ["Delhi", "Panipat", "Ambala", "Chandigarh", "Kalka", "Solan", "Shimla"],
    accent: "BW",
  },
  {
    id: "central-india-night-mail",
    name: "The Central India Night Sky",
    strapline: "Old cantonments, lake cities and lamps after dark",
    origin: "Lucknow",
    destination: "Pune",
    duration: "5 daily landings",
    tone: "Central India · night warmth",
    transport: "Courtyards · lake walls · evening balconies",
    stops: ["Lucknow", "Kanpur", "Jhansi", "Bhopal", "Indore", "Nashik", "Pune"],
    accent: "NS",
  },
  {
    id: "kerala-homecoming",
    name: "The Kerala Homecoming",
    strapline: "Familiar rain, tiled roofs and evening lamps",
    origin: "Kozhikode",
    destination: "Thiruvananthapuram",
    duration: "5 daily landings",
    tone: "Kerala · intimate and local",
    transport: "Coconut trees · backwaters · warm verandas",
    stops: ["Kozhikode", "Thrissur", "Ernakulam", "Kottayam", "Alappuzha", "Kollam", "Thiruvananthapuram"],
    accent: "KH",
  },
  {
    id: "letters-across-seas",
    name: "Across Seas",
    strapline: "A piece of home travelling from Kochi to London",
    origin: "Kochi",
    destination: "London",
    duration: "7 daily landings",
    tone: "India to overseas · homesickness and return",
    transport: "Harbour wind · night sky · foreign rooftops",
    stops: ["Kochi", "Mumbai", "Dubai", "London Heathrow", "London"],
    accent: "AS",
  },
];

export const allRouteCities = Array.from(
  new Set(routeCorridors.flatMap((route) => route.stops)),
).sort((a, b) => a.localeCompare(b));
