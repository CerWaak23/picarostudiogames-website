import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mar Bravo — Picaro Game Studio",
  description:
    "A naval roguelite for mobile. Your cannons fire from the sides, so steering is aiming: survive the rounds, beat each captain and build your ship.",
};

export default function MarBravoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
