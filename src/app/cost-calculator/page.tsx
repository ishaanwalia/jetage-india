import type { Metadata } from "next";
import { CostCalculatorClient } from "./CostCalculatorClient";

export const metadata: Metadata = {
  title: "Printer Cost Calculator — True 3-Year Cost of Smart Tank vs InkJet vs Laser",
  description:
    "The sticker price is only half the story. Calculate the true 3-year cost of owning a Smart Tank, InkJet or Laser printer including ink and toner, based on your monthly printing.",
  alternates: { canonical: "/cost-calculator/" },
};

export default function CostCalculatorPage() {
  return <CostCalculatorClient />;
}
