import type { Metadata } from "next";
import { CompareClient } from "./CompareClient";

export const metadata: Metadata = {
  title: "Compare HP Products Side by Side",
  description:
    "Compare up to 3 HP laptops, desktops, monitors, printers or accessories side by side — price, specs and more. Pick the right product with Jetage India, authorized HP dealer in Chandigarh.",
  alternates: { canonical: "/compare/" },
};

export default function ComparePage() {
  return <CompareClient />;
}
