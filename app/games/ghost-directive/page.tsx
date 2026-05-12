import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Ghost Directive — Picaro Game Studio",
  description:
    "A 3D top-down tactical stealth game. Plan in silence, execute in real time. Command your squad, infiltrate enemy territory, and vanish like a ghost.",
};

const features = [
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 3v1m0 16v1M4.22 4.22l.7.7m12.16 12.16.7.7M3 12h1m16 0h1M4.92 19.08l.7-.7M18.38 4.62l.7-.7" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    title: "Plan & Execute",
    description:
      "Pause time to lay out every step of the operation. Set waypoints, assign targets, choose actions. Then press Play and watch your plan unfold in real time.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Squad Tactics",
    description:
      "Lead a team of operatives, each with distinct capabilities. Coordinate simultaneous actions — a hack here, a distraction there — to dismantle any enemy setup.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "Dynamic AI",
    description:
      "Enemies patrol, investigate, chase, and raise alarms. Vision cones, noise detection, and coordinated responses mean every mistake can cascade — plan accordingly.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "Tactical Objectives",
    description:
      "Sabotage power plants, hack comm centers, breach gates, and eliminate targets. Each building reacts — breach one and the chain of consequences follows.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Stealth or Force",
    description:
      "Slip through undetected — or go loud and fight your way out. Your approach changes how the enemy responds. Silence is power; noise has consequences.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Speed Control",
    description:
      "Slow time to analyze a critical moment or crank it up once the plan is in motion. Full control over the pace of the operation — you decide when to act.",
  },
];

export default function GhostDirectivePage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted text-sm hover:text-gold transition-colors mb-10 font-mono uppercase tracking-wider"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M11 5L5 11M5 11h6M5 11V5" />
            </svg>
            All Games
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono tracking-widest uppercase border border-gold/30 bg-gold/5 text-gold px-3 py-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
              In Development
            </span>
            <span className="text-xs font-mono tracking-widest uppercase border border-white/8 text-muted px-3 py-1.5">
              PC · Unity
            </span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-black tracking-tight text-text-primary mb-6"
            style={{ textShadow: "0 0 80px rgba(201,168,76,0.15)" }}
          >
            GHOST
            <br />
            <span className="text-gold">DIRECTIVE</span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl leading-relaxed">
            A 3D top-down tactical stealth game where preparation is everything.
            Plan every move in the silence of the planning phase — then watch your
            squad execute in real time.
          </p>
        </div>
      </section>

      {/* ─── KEY ART PLACEHOLDER ─── */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div
            className="w-full h-72 md:h-96 border border-white/8 flex items-center justify-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0d0d16 0%, #141424 50%, #0a0a12 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(201,168,76,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.1) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="text-center relative z-10">
              <div className="w-20 h-20 border-2 border-gold/30 rotate-45 flex items-center justify-center mx-auto mb-4">
                <div className="w-5 h-5 bg-gold/50 rotate-[-45deg]" />
              </div>
              <p className="text-muted font-mono text-xs tracking-widest uppercase">
                Screenshots & Trailer Coming Soon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT THE GAME ─── */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 max-w-12 bg-gold/40" />
            <span className="text-gold text-xs tracking-widest uppercase font-mono">
              About
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-8">
            The Mission
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-text-secondary leading-relaxed text-base">
            <div className="space-y-4">
              <p>
                Every mission in <span className="text-gold font-medium">Ghost Directive</span> is a
                puzzle. You control time itself — pausing to study the map, mark
                patrol routes, and assign your operatives their exact movements and
                actions.
              </p>
              <p>
                When you&apos;re ready, you press Play. Your squad moves as planned —
                and the world reacts in real time. Guards investigate sounds, cameras
                sweep, and alarms cascade if things go wrong.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Stealth is your greatest weapon, but sometimes operations demand
                force. Sabotage power plants, hack security systems, breach
                fortified gates, and eliminate high-value targets.
              </p>
              <p>
                Ghost Directive rewards patience and creativity. The best operatives
                are the ones nobody ever saw.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 max-w-12 bg-gold/40" />
            <span className="text-gold text-xs tracking-widest uppercase font-mono">
              Features
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-12">
            Core Mechanics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="border border-white/8 bg-surface p-6 flex flex-col gap-4 hover:border-gold/20 transition-colors"
              >
                <div className="text-gold">{f.icon}</div>
                <h3 className="font-bold text-text-primary">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATUS BANNER ─── */}
      <section className="py-16 px-6 bg-surface border-t border-b border-white/5">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-black text-text-primary mb-2">
              Currently in active development
            </h3>
            <p className="text-text-secondary text-sm">
              Follow us on social media to get updates, screenshots, and
              behind-the-scenes dev logs as we build Ghost Directive.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 bg-gold text-bg font-bold text-sm tracking-widest uppercase px-6 py-3 hover:bg-gold-light transition-colors"
            >
              Stay Updated
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
