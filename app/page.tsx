"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/lib/LanguageContext";

export default function Home() {
  const { tr } = useLang();

  const game = {
    slug: "ghost-directive",
    title: "Ghost Directive",
    genre: "Tactical Stealth / Strategy",
    statusColor: "text-gold border-gold/30 bg-gold/5",
    tags: ["PC", "Unity", "Top-Down", "Stealth"],
    accent: "#c9a84c",
  };

  const stats = [
    { label: tr.about.stat1, value: "1" },
    { label: tr.about.stat2, value: "Unity" },
    { label: tr.about.stat3, value: "Tactical" },
    { label: tr.about.stat4, value: "PC" },
  ];

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* ─── HERO ─── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #a8a8a8 0%, #c8c8c8 25%, #dedede 55%, #efefef 80%, #f8f8f8 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 border border-[#c9a84c]/40 bg-[#c9a84c]/10 text-[#7a5e1a] text-xs tracking-widest uppercase px-4 py-2 mb-8 font-mono">
            <span className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full animate-pulse" />
            {tr.hero.badge}
          </div>

          <div className="flex justify-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/1.1.png" alt="Picaro Game Studio" className="w-44 md:w-56 h-auto" />
          </div>

          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed">
            {tr.hero.tagline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#games"
              className="inline-flex items-center gap-2 bg-[#c9a84c] text-white font-bold text-sm tracking-widest uppercase px-8 py-4 hover:bg-[#b8932e] transition-colors"
            >
              {tr.hero.cta}
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 12l6-6M11 6H5M11 6v6" />
              </svg>
            </Link>
            <Link
              href="#about"
              className="inline-flex items-center gap-2 border border-gray-500/40 text-gray-700 font-medium text-sm tracking-widest uppercase px-8 py-4 hover:border-gray-700 hover:text-gray-900 transition-colors"
            >
              {tr.hero.about}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 text-xs tracking-widest uppercase animate-bounce">
          <span>{tr.hero.scroll}</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M8 3v10M3 8l5 5 5-5" />
          </svg>
        </div>
      </section>

      {/* ─── GAMES ─── */}
      <section id="games" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 max-w-12 bg-gold/40" />
              <span className="text-gold text-xs tracking-widest uppercase font-mono">
                {tr.games.sectionLabel}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-text-primary">
              {tr.games.sectionTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href={`/games/${game.slug}`}>
              <div className="group relative border border-white/8 bg-surface card-hover h-full flex flex-col">
                <div
                  className="h-52 relative overflow-hidden flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #10101a 0%, #18182a 50%, #0f0f18 100%)" }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: "linear-gradient(rgba(201,168,76,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.15) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  <div
                    className="w-16 h-16 border-2 rotate-45 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity"
                    style={{ borderColor: game.accent }}
                  >
                    <div className="w-4 h-4 rotate-[-45deg]" style={{ backgroundColor: game.accent }} />
                  </div>
                  <div className="absolute top-3 right-3 text-xs font-mono tracking-widest uppercase opacity-30 group-hover:opacity-60 transition-opacity" style={{ color: game.accent }}>
                    KEY ART SOON
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-text-primary group-hover:text-gold transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-sm text-muted mt-1">{game.genre}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-mono tracking-wide border px-2.5 py-1 ${game.statusColor}`}>
                      {tr.games.status}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {tr.games.ghostDescription}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {game.tags.map((tag) => (
                      <span key={tag} className="text-xs text-muted border border-white/8 px-2.5 py-1 font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 text-muted group-hover:text-gold transition-colors group-hover:translate-x-1 group-hover:-translate-y-1 transform transition-transform">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M5 13L13 5M13 5H7M13 5v6" />
                  </svg>
                </div>
              </div>
            </Link>

            <div className="border border-dashed border-white/8 bg-surface/50 flex items-center justify-center h-full min-h-[300px] p-12">
              <div className="text-center">
                <div className="w-10 h-10 border border-white/10 rotate-45 flex items-center justify-center mx-auto mb-4">
                  <span className="rotate-[-45deg] text-muted text-lg font-thin">+</span>
                </div>
                <p className="text-muted text-sm tracking-wider uppercase font-mono">
                  {tr.games.comingSoon}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-24 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 max-w-12 bg-gold/40" />
            <span className="text-gold text-xs tracking-widest uppercase font-mono">
              {tr.about.sectionLabel}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-text-primary mb-16">
            {tr.about.title}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-5 text-text-secondary leading-relaxed text-base">
              <p>{tr.about.p1}</p>
              <p>
                {tr.about.p2.split("Ghost Directive").map((part, i) =>
                  i === 0 ? part : (
                    <span key={i}><span className="text-gold font-medium">Ghost Directive</span>{part}</span>
                  )
                )}
              </p>
              <p>{tr.about.p3}</p>

              <div className="grid grid-cols-2 gap-3 pt-4">
                {stats.map((item) => (
                  <div key={item.label} className="border border-white/8 p-4 flex flex-col gap-1">
                    <span className="text-2xl font-black text-gold">{item.value}</span>
                    <span className="text-xs text-muted uppercase tracking-wider font-mono">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-start gap-6">
              <div className="border border-white/8 bg-bg p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start w-full max-w-sm lg:max-w-full">
                <div className="relative shrink-0">
                  <div className="w-28 h-28 overflow-hidden border-2 border-gold/20">
                    <Image src="/team/andres.jpg" alt="Andrés Cerda Waak" width={112} height={112} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gold/80 rotate-45" />
                </div>

                <div className="text-center sm:text-left">
                  <h3 className="text-text-primary font-bold text-lg">Andrés Cerda Waak</h3>
                  <p className="text-gold text-sm font-mono tracking-wide mt-1">{tr.about.role}</p>
                  <p className="text-text-secondary text-sm mt-3 leading-relaxed">{tr.about.bio}</p>
                  <a
                    href="https://www.instagram.com/picarogamestudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-xs text-muted hover:text-gold transition-colors font-mono"
                  >
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    @picarogamestudio
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px flex-1 max-w-12 bg-gold/40" />
            <span className="text-gold text-xs tracking-widest uppercase font-mono">
              {tr.contact.sectionLabel}
            </span>
            <div className="h-px flex-1 max-w-12 bg-gold/40" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-text-primary mb-6">
            {tr.contact.title}
          </h2>
          <p className="text-text-secondary mb-10 text-lg">{tr.contact.description}</p>
          <a
            href="mailto:picarogamestudio@gmail.com"
            className="inline-flex items-center gap-3 border border-gold/30 bg-gold/5 text-gold text-sm tracking-widest uppercase px-8 py-4 hover:bg-gold/10 hover:border-gold/60 transition-colors font-mono"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 8l9-5 9 5v10H3V8z" />
              <path d="M3 8l9 5 9-5" />
            </svg>
            picarogamestudio@gmail.com
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
