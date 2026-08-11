import type { Metadata } from "next";
import { PostboxHome } from "@/components/postbox-home";

export const metadata: Metadata = {
  title: "Intezaar — End-to-end encrypted letters for later",
  description: "Write an end-to-end encrypted digital letter, choose when it can be opened, or leave a private letter for your future self with Intezaar.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: "Intezaar — Write it now. Let it arrive later.",
    description: "Private digital letters with end-to-end encrypted content and a chosen opening time — for someone else or your future self.",
  },
};

export default function Home() {
  return <PostboxHome />;
}
