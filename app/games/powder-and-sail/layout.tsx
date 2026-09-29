import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Powder & Sail — Picaro Game Studio",
  description:
    "A naval roguelite for mobile. Command a pirate ship on the open sea, clear each zone, pick upgrade cards and sail on.",
};

export default function PowderAndSailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
