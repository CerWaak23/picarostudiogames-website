import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitness Era — Privacidad y términos · Privacy and terms",
  description:
    "Política de privacidad, aviso de salud y términos de uso de Fitness Era. Privacy policy, health notice and terms of use for Fitness Era.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
