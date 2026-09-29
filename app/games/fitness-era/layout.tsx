import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitness Era — Picaro Game Studio",
  description:
    "A mobile fitness RPG: your push-ups are your attacks. Travel through the eras of history fighting rivals with real exercise, counted by your phone's camera.",
};

export default function FitnessEraLayout({ children }: { children: React.ReactNode }) {
  return children;
}
