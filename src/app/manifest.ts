import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Intezaar — A nostalgic Indian letter journey",
    short_name: "Intezaar",
    description:
      "Create a private letter that travels through Indian post boxes, railway routes and memories before it arrives.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3ead8",
    theme_color: "#8f2f20",
    orientation: "portrait-primary",
  };
}
