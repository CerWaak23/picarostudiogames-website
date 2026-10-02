import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata: Metadata = {
  title: "Picaro Game Studio",
  description:
    "Chilean indie game studio. Home of Fitness Era, Powder & Sail and Ghost Directive.",
  keywords: ["indie game studio", "Chilean game studio", "Chile", "Fitness Era", "Powder & Sail", "Ghost Directive"],
  openGraph: {
    title: "Picaro Game Studio",
    description: "Games from the end of the world. Chilean indie game studio.",
    url: "https://picarogamestudio.com",
    siteName: "Picaro Game Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Picaro Game Studio",
    description: "Games from the end of the world. Chilean indie game studio.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
