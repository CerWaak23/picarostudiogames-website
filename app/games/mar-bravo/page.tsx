"use client";

import Image from "next/image";
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
      "Te desterraron a Juan Fernández y te escapaste en una lancha con un cañón. Ahora el mar del sur se te viene encima: maniobra, da el costado y no te hundas.",
    art: "Mar Bravo: un bergantín dispara su andanada frente a una ola gigante",
    aboutLabel: "El juego",
    aboutTitle: "Maniobrar es apuntar",
    about: [
      "Mar Bravo es un roguelite naval para celular, visto desde arriba. Tus cañones disparan solos, pero solo por los costados: ganar es cuestión de girar a tiempo, darle el flanco al enemigo y no quedar en su mira. Su proa y su popa son puntos ciegos, y los tuyos también.",
      "Cada ruta son cinco lugares de rondas cada vez más duras, con un minijefe al final de cada uno y un jefe esperando al final de la isla. Si te hundes vuelves al puerto, pero con lo que juntaste mejoras tu barco y lo intentas de nuevo.",
    ],
    featuresLabel: "Características",
    featuresTitle: "Lo esencial",
    features: [
      { title: "Andanadas por las bandas", text: "Los cañones disparan solos hacia los costados. La posición del barco lo es todo." },
      { title: "El viento manda", text: "De popa vuelas, contra el viento te arrastras. Saca los remos cuando haga falta." },
      { title: "Cartas en cada partida", text: "Sube de nivel hundiendo barcos y elige entre tres: bala de fuego, metralla, palanquetas, barriles…" },
      { title: "Minijefes y jefes", text: "Cada lugar cierra con un capitán distinto, y al final de la isla te espera algo mucho peor." },
      { title: "Un barco por piezas", text: "Arma tu barco en el astillero: cascos, velas y cañones que se descubren y suben de nivel." },
      { title: "Hasta 6 en el mar", text: "Partidas online todos contra todos o por equipos, desde la taberna del puerto." },
    ],
    bannerTitle: "En desarrollo activo",
    bannerText: "Síguenos en redes para ver avances y devlogs de Mar Bravo.",
    bannerCta: "Mantenerme al tanto",
  },
  en: {
    back: "All Games",
    status: "In Development",
    platforms: "Android · iOS · Unity",
    tagline:
      "Exiled to Juan Fernández, you escaped on a launch with a single cannon. Now the southern sea is coming for you: maneuver, turn side-on and stay afloat.",
    art: "Mar Bravo: a brig fires its broadside in front of a giant wave",
    aboutLabel: "The game",
    aboutTitle: "Steering is aiming",
    about: [
      "Mar Bravo is a top-down naval roguelite for mobile. Your cannons fire on their own, but only from the sides: winning is about turning in time, giving the enemy your broadside and staying out of theirs. Bows and sterns are blind spots, yours included.",
      "Each route is five places of ever tougher rounds, with a mini-boss closing each one and a boss waiting at the end of the island. Sink and you're back in port, but what you gathered upgrades your ship for the next try.",
    ],
    featuresLabel: "Features",
    featuresTitle: "The essentials",
    features: [
      { title: "Broadside cannons", text: "Your cannons fire to the sides on their own. Your ship's position is everything." },
      { title: "The wind rules", text: "Downwind you fly, upwind you crawl. Bring out the oars when you need them." },
      { title: "Cards every run", text: "Level up by sinking ships and pick one of three: fire shot, grapeshot, chain shot, barrels…" },
      { title: "Mini-bosses and bosses", text: "Every place ends with a different captain, and something far worse waits at the end of the island." },
      { title: "A ship built from parts", text: "Build your ship at the shipyard: hulls, sails and cannons you unlock and level up." },
      { title: "Up to 6 at sea", text: "Online matches, free-for-all or in teams, from the harbor tavern." },
    ],
    bannerTitle: "In active development",
    bannerText: "Follow us on social media for progress and Mar Bravo devlogs.",
    bannerCta: "Stay Updated",
  },
};

export default function MarBravoPage() {
  const { lang } = useLang();
  const c = copy[lang];

  return (
    <div className="min-h-screen">
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
            className="inline-flex items-center gap-2 text-muted text-sm hover:text-accent-text transition-colors mb-10 font-mono uppercase tracking-wider"
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
            <span className="text-xs font-mono tracking-widest uppercase border border-graphite-2 text-muted px-3 py-1.5">
              {c.platforms}
            </span>
          </div>

          <h1
            className="font-display text-[clamp(2.6rem,7vw,5rem)] leading-[0.92] tracking-display text-bone mb-6"
            style={{ textShadow: "0 0 80px rgba(74,159,216,0.18)" }}
          >
            MAR <span style={{ color: ACCENT }}>BRAVO</span>
          </h1>
          <p className="text-xl text-bone-dim max-w-2xl leading-relaxed">{c.tagline}</p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5">
            <div className="relative w-full aspect-video border border-graphite-2 overflow-hidden">
              <Image
                src="/games/mar-bravo/portada-titulo.jpg"
                alt={c.art}
                fill
                priority
                sizes="(min-width: 768px) 600px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="relative w-full aspect-[2/3] border border-graphite-2 overflow-hidden hidden md:block">
              <Image
                src="/games/mar-bravo/portada-vertical.jpg"
                alt={c.art}
                fill
                sizes="300px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-ink-2">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>{c.aboutLabel}</SectionLabel>
          <h2 className="font-sans font-light tracking-[-0.025em] text-[clamp(1.9rem,4.4vw,3rem)] text-bone mb-8">{c.aboutTitle}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-bone-dim leading-relaxed text-base">
            {c.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>{c.featuresLabel}</SectionLabel>
          <h2 className="font-sans font-light tracking-[-0.025em] text-[clamp(1.9rem,4.4vw,3rem)] text-bone mb-12">{c.featuresTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {c.features.map((f) => (
              <div key={f.title} className="border border-graphite-2 bg-ink-2 p-6 flex flex-col gap-3 hover:border-accent/20 transition-colors">
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: ACCENT }} />
                <h3 className="font-sans font-semibold text-bone">{f.title}</h3>
                <p className="text-sm text-bone-dim leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-ink-2 border-t border-b border-graphite-2/60">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] tracking-display text-bone mb-2">{c.bannerTitle}</h3>
            <p className="text-bone-dim text-sm">{c.bannerText}</p>
          </div>
          <Link
            href="/#contact"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-accent-fill text-accent-on font-mono font-bold text-xs tracking-[0.18em] uppercase px-6 py-3 hover:bg-bone transition-colors"
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
      <div className="h-px flex-1 max-w-12 bg-accent/40" />
      <span className="text-accent-text text-xs tracking-widest uppercase font-mono">{children}</span>
    </div>
  );
}
