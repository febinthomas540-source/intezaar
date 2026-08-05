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
    name: "The Grand Trunk Homecoming",
    strapline: "Old Delhi platforms to the Kerala backwaters",
    origin: "Delhi",
    destination: "Alappuzha",
    duration: "8–10 days",
    tone: "North-to-south · long-form nostalgia",
    transport: "Railway mail · coastal road · final boat",
    stops: ["Delhi", "Agra", "Jaipur", "Ahmedabad", "Mumbai", "Goa", "Mangaluru", "Kozhikode", "Kottayam", "Alappuzha"],
    accent: "GT",
  },
  {
    id: "konkan-rain-letter",
    name: "The Konkan Rain Letter",
    strapline: "A monsoon route beside the Arabian Sea",
    origin: "Mumbai",
    destination: "Kochi",
    duration: "5–7 days",
    tone: "West coast · rain and sea air",
    transport: "Konkan railway · harbour mail",
    stops: ["Mumbai", "Ratnagiri", "Goa", "Karwar", "Mangaluru", "Kozhikode", "Thrissur", "Kochi"],
    accent: "KR",
  },
  {
    id: "coromandel-post",
    name: "The Coromandel Post",
    strapline: "Howrah mornings to Chennai sea breeze",
    origin: "Kolkata",
    destination: "Chennai",
    duration: "5–7 days",
    tone: "East coast · literature and salt air",
    transport: "Mail express · coastal bus",
    stops: ["Kolkata", "Kharagpur", "Bhubaneswar", "Puri", "Visakhapatnam", "Vijayawada", "Nellore", "Chennai"],
    accent: "CP",
  },
  {
    id: "himalayan-blue-mail",
    name: "The Himalayan Blue Mail",
    strapline: "Plains, pine mist and a quiet mountain arrival",
    origin: "Delhi",
    destination: "Shimla",
    duration: "3–5 days",
    tone: "Himalayan · winter memory",
    transport: "Northern mail · toy train",
    stops: ["Delhi", "Panipat", "Ambala", "Chandigarh", "Kalka", "Solan", "Shimla"],
    accent: "HB",
  },
  {
    id: "central-india-night-mail",
    name: "The Central India Night Mail",
    strapline: "A slower crossing through old cantonments and lake cities",
    origin: "Lucknow",
    destination: "Pune",
    duration: "5–7 days",
    tone: "Central India · night train warmth",
    transport: "Sleeper mail · postal van",
    stops: ["Lucknow", "Kanpur", "Jhansi", "Bhopal", "Indore", "Nashik", "Pune"],
    accent: "NM",
  },
  {
    id: "kerala-homecoming",
    name: "The Kerala Homecoming",
    strapline: "A short journey through familiar rain and evening lamps",
    origin: "Kozhikode",
    destination: "Thiruvananthapuram",
    duration: "3–5 days",
    tone: "Kerala · intimate and local",
    transport: "Malabar express · KSRTC · final postman walk",
    stops: ["Kozhikode", "Thrissur", "Ernakulam", "Kottayam", "Alappuzha", "Kollam", "Thiruvananthapuram"],
    accent: "KH",
  },
  {
    id: "letters-across-seas",
    name: "Letters Across Seas",
    strapline: "A piece of home travelling from Kochi to London",
    origin: "Kochi",
    destination: "London",
    duration: "7–10 days",
    tone: "India to overseas · homesickness and return",
    transport: "Coastal mail · airport night · international post",
    stops: ["Kochi", "Mumbai", "Dubai", "London Heathrow", "London"],
    accent: "AS",
  },
];

export const allRouteCities = Array.from(
  new Set(routeCorridors.flatMap((route) => route.stops)),
).sort((a, b) => a.localeCompare(b));
