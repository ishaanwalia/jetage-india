import type { Metadata } from "next";
import { FinderClient } from "./FinderClient";

export const metadata: Metadata = {
  title: "Printer Finder — Answer 5 Questions, Meet Your Printer",
  description:
    "Not sure which HP printer to buy? Answer 5 quick questions about your usage, volume and budget, and get personalised recommendations from Jetage India, authorized HP dealer in Chandigarh.",
  alternates: { canonical: "/finder/" },
};

export default function FinderPage() {
  return <FinderClient />;
}
