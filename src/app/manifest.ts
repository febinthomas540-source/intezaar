import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Intezaar — A letter that travels by train",
    short_name: "Intezaar",
    description:
      "Write a private letter, let it travel through a cinematic Indian mail journey, and open it when it arrives.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f3ead8",
    theme_color: "#8f2f20",
    orientation: "portrait-primary",
    categories: ["lifestyle", "entertainment"],
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
