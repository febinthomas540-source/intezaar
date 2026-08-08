import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Intezaar — Private digital letters",
    short_name: "Intezaar",
    description:
      "Write a private digital letter, choose when it opens, seal it and post it for later.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f3ead8",
    theme_color: "#271711",
    orientation: "portrait-primary",
    categories: ["lifestyle", "entertainment"],
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
    shortcuts: [
      {
        name: "Write a letter",
        short_name: "Write",
        description: "Start a private Intezaar letter",
        url: "/create",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "How it works",
        short_name: "How it works",
        description: "See how Intezaar letters work",
        url: "/#how-it-works",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
    ],
  };
}
