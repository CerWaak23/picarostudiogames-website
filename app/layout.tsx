import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import SkinSwitcher from "@/components/SkinSwitcher";

/** DeLight, la principal del manual. El archivo es variable: 100 a 900. */
const delight = localFont({
  src: "./fonts/delight-vf.ttf",
  variable: "--font-delight",
  display: "swap",
  weight: "100 900",
  fallback: ["system-ui", "sans-serif"],
});

/** Ruina, la terciaria. Solo para el lockup y los nombres de juego. */
const ruina = localFont({
  src: "./fonts/ruina.ttf",
  variable: "--font-ruina",
  display: "swap",
  weight: "400",
  fallback: ["Impact", "sans-serif"],
});

/** JetBrains Mono, la secundaria del manual. */
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://picarogamestudio.com"),
  title: {
    default: "Pícaro Game Studio",
    template: "%s · Pícaro Game Studio",
  },
  description:
    "Estudio indie chileno. Juegos ingeniosos, con humor y astucia. Fitness Era, Powder & Sail y Ghost Directive.",
  keywords: [
    "estudio indie",
    "videojuegos chilenos",
    "Chile",
    "Fitness Era",
    "Powder & Sail",
    "Ghost Directive",
  ],
  openGraph: {
    title: "Pícaro Game Studio",
    description: "En el fin del Mundo, inicia la picardía. Estudio indie chileno.",
    url: "https://picarogamestudio.com",
    siteName: "Pícaro Game Studio",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pícaro Game Studio",
    description: "En el fin del Mundo, inicia la picardía. Estudio indie chileno.",
  },
  icons: {
    icon: "/brand/mark.svg",
  },
};

export const viewport = {
  themeColor: "#161814",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* El script de más abajo escribe data-skin, y LanguageContext escribe lang,
       los dos antes de que React hidrate. Son cambios buscados sobre <html>, no
       una diferencia real entre servidor y cliente: sin esto React avisa de un
       desajuste de hidratación en cada carga. */
    <html
      lang="es"
      suppressHydrationWarning
      className={`${delight.variable} ${ruina.variable} ${mono.variable}`}
    >
      <head>
        {/* Aplica el estilo guardado antes del primer pintado: si no, quien
            eligió «Vino» o «Papel» ve un parpadeo de «Cítrico» al entrar. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=localStorage.getItem('picaro-skin');if(s==='vino'||s==='papel'||s==='citrico')document.documentElement.dataset.skin=s;}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-ink text-bone">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-accent focus:text-accent-on focus:px-4 focus:py-2 focus:font-mono focus:text-sm"
        >
          Saltar al contenido
        </a>
        <LanguageProvider>{children}</LanguageProvider>
        <SkinSwitcher />
      </body>
    </html>
  );
}
