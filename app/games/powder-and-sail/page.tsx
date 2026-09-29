"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/lib/LanguageContext";

const ACCENT = "#4a9fd8";

const copy = {
  es: {
    back: "Todos los juegos",
    status: "En desarrollo",
    platforms: "Android · iOS · Unity",
    tagline:
      "Comanda un barco pirata en mar abierto. Despeja cada zona de enemigos, elige cartas de mejora y sigue navegando: cada partida es distinta.",
    art: "Capturas y tráiler próximamente",
    aboutLabel: "El juego",
    aboutTitle: "A toda vela",
    about: [
      "Powder & Sail es un roguelite de barcos piratas para celular, visto desde arriba. Cada partida es una travesía: despejas una zona del mar y sigues a la siguiente, cada vez más peligrosa.",
      "Tu barco dispara por las bandas, así que ganar es cuestión de maniobrar: ponerte de costado, esquivar las andanadas enemigas y elegir bien cuándo acercarte.",
    ],
    featuresLabel: "Características",
    featuresTitle: "Lo esencial",
    features: [
      { title: "Cañones por las bandas", text: "Dispara a babor y estribor. La posición del barco lo es todo." },
      { title: "Cartas de mejora", text: "Tres opciones, eliges una. Cada partida arma un barco distinto." },
      { title: "Zona por zona", text: "Despeja el mar y avanza. Cada zona trae enemigos nuevos." },
      { title: "Islas", text: "Islas que esconden recompensas y otras que te obligan a rodearlas." },
    ],
    bannerTitle: "En desarrollo activo",
    bannerText: "Síguenos en redes para ver avances y devlogs de Powder & Sail.",
    bannerCta: "Mantenerme al tanto",
  },
  en: {
    back: "All Games",
    status: "In Development",
    platforms: "Android · iOS · Unity",
    tagline:
      "Command a pirate ship on the open sea. Clear each zone of enemies, pick upgrade cards and sail on — every run is different.",
    art: "Screenshots & trailer coming soon",
    aboutLabel: "The game",
    aboutTitle: "Full sail ahead",
    about: [
      "Powder & Sail is a top-down pirate ship roguelite for mobile. Every run is a voyage: clear a zone of the sea and sail on to the next, each more dangerous than the last.",
      "Your ship fires from its broadsides, so winning is all about maneuvering: turning side-on, dodging enemy volleys and choosing when to close in.",
    ],
    featuresLabel: "Features",
    featuresTitle: "The essentials",
    features: [
      { title: "Broadside cannons", text: "Fire to port and starboard. Your ship's position is everything." },
      { title: "Upgrade cards", text: "Three choices, pick one. Every run builds a different ship." },
      { title: "Zone by zone", text: "Clear the sea and push on. Each zone brings new enemies." },
      { title: "Islands", text: "Islands that hide rewards, and others you'll have to sail around." },
    ],
    bannerTitle: "In active development",
    bannerText: "Follow us on social media for progress and Powder & Sail devlogs.",
    bannerCta: "Stay Updated",
  },
};

export default function PowderAndSailPage() {
  const { lang } = useLang();
  const c = copy[lang];

  return (
    <div className="min-h-screen bg-bg">
      <Navbar solid />

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(74,159,216,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(74,159,216,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] max-w-full h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(74,159,216,0.09) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <Link
            href="/#games"
            className="inline-flex items-center gap-2 text-muted text-sm hover:text-gold transition-colors mb-10 font-mono uppercase tracking-wider"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M11 5L5 11M5 11h6M5 11V5" />
            </svg>
            {c.back}
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className="text-xs font-mono tracking-widest uppercase border px-3 py-1.5 flex items-center gap-2"
              style={{ color: ACCENT, borderColor: `${ACCENT}4d`, backgroundColor: `${ACCENT}0d` }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
              {c.status}
            </span>
            <span className="text-xs font-mono tracking-widest uppercase border border-white/8 text-muted px-3 py-1.5">
              {c.platforms}
            </span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-black tracking-tight text-text-primary mb-6"
            style={{ textShadow: "0 0 80px rgba(74,159,216,0.18)" }}
          >
            POWDER <span style={{ color: ACCENT }}>&amp; SAIL</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl leading-relaxed">{c.tagline}</p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div
            className="w-full h-72 md:h-96 border border-white/8 flex items-center justify-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0a1420 0%, #0f2033 50%, #08111b 100%)" }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(74,159,216,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(74,159,216,0.12) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="text-center relative z-10">
              <div className="w-20 h-20 border-2 rotate-45 flex items-center justify-center mx-auto mb-4" style={{ borderColor: `${ACCENT}4d` }}>
                <div className="w-5 h-5 rotate-[-45deg]" style={{ backgroundColor: `${ACCENT}80` }} />
              </div>
              <p className="text-muted font-mono text-xs tracking-widest uppercase">{c.art}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-surface">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>{c.aboutLabel}</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-8">{c.aboutTitle}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-text-secondary leading-relaxed text-base">
            {c.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>{c.featuresLabel}</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-12">{c.featuresTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {c.features.map((f) => (
              <div key={f.title} className="border border-white/8 bg-surface p-6 flex flex-col gap-3 hover:border-gold/20 transition-colors">
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: ACCENT }} />
                <h3 className="font-bold text-text-primary">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-surface border-t border-b border-white/5">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-black text-text-primary mb-2">{c.bannerTitle}</h3>
            <p className="text-text-secondary text-sm">{c.bannerText}</p>
          </div>
          <Link
            href="/#contact"
            className="shrink-0 inline-flex items-center gap-2 bg-gold text-bg font-bold text-sm tracking-widest uppercase px-6 py-3 hover:bg-gold-light transition-colors"
          >
            {c.bannerCta}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="h-px flex-1 max-w-12 bg-gold/40" />
      <span className="text-gold text-xs tracking-widest uppercase font-mono">{children}</span>
    </div>
  );
}
