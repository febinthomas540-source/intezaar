import type { Metadata } from "next";
import { PostboxHome } from "@/components/postbox-home";

export const metadata: Metadata = {
  title: "Intezaar — Write, seal and post a letter for later",
  description: "Create a private digital letter, choose when it can be opened, seal it and post it through the Intezaar letter box.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: "Intezaar — Write it. Seal it. Post it.",
    description: "A private digital letter you write, seal, post and open later.",
  },
};

export default function Home() {
  return <PostboxHome />;
}
