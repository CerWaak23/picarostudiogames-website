import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Picaro Game Studio",
  description:
    "Indie game studio crafting tactical and strategy experiences. Home of Ghost Directive.",
  keywords: ["indie game studio", "tactical games", "strategy games", "Ghost Directive"],
  openGraph: {
    title: "Picaro Game Studio",
    description: "Indie game studio crafting tactical and strategy experiences.",
    url: "https://picarogamestudio.com",
    siteName: "Picaro Game Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Picaro Game Studio",
    description: "Indie game studio crafting tactical and strategy experiences.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
