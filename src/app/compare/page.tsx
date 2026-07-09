import type { Metadata } from "next";
import { CompareClient } from "./CompareClient";

export const metadata: Metadata = {
  title: "Compare HP Printers Side by Side",
  description:
    "Compare up to 3 HP printers side by side — price, speed, running costs, duplex, connectivity and more. Pick the right printer with Jetage India, authorized HP dealer in Chandigarh.",
  alternates: { canonical: "/compare/" },
};

export default function ComparePage() {
  return <CompareClient />;
}
