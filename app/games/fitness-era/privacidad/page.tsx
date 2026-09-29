"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/lib/LanguageContext";
import { policy, POLICY_DATE, POLICY_VERSION, CONTACT_EMAIL } from "@/lib/fitnessEraLegal";

/**
 * La política completa de Fitness Era. Esta es la dirección que se entrega a Google Play y
 * a App Store Connect, y la que abre el botón «Ver política completa» dentro del juego.
 */
export default function FitnessEraPrivacyPage() {
  const { lang } = useLang();
  const p = policy[lang];

  return (
    <div className="min-h-screen bg-bg">
      <Navbar solid />

      <main className="pt-32 pb-24 px-6">
        <article className="max-w-3xl mx-auto">
          <Link
            href="/games/fitness-era#privacidad"
            className="inline-flex items-center gap-2 text-muted text-sm hover:text-gold transition-colors mb-10 font-mono uppercase tracking-wider"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M11 5L5 11M5 11h6M5 11V5" />
            </svg>
            Fitness Era
          </Link>

          <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-3">{p.title}</h1>
          <p className="text-sm text-muted font-mono mb-8">
            {lang === "es" ? "Versión" : "Version"} {POLICY_VERSION} · {POLICY_DATE[lang]}
          </p>
          <p className="text-lg text-text-secondary leading-relaxed mb-12">{p.intro}</p>

          <nav className="border border-white/8 bg-surface p-6 mb-14">
            <p className="text-gold text-xs tracking-widest uppercase font-mono mb-3">
              {lang === "es" ? "Contenido" : "Contents"}
            </p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {p.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-text-secondary hover:text-gold transition-colors">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-12">
            {p.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4">
                  <span className="text-gold font-mono text-base mr-2">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  {s.paragraphs?.map((t) => <p key={t}>{t}</p>)}
                  {s.bullets && (
                    <ul className="space-y-2">
                      {s.bullets.map((t) => (
                        <li key={t} className="flex gap-3">
                          <span className="mt-2.5 w-1.5 h-1.5 shrink-0 rotate-45 bg-gold/70" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.after?.map((t) => <p key={t}>{t}</p>)}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-white/8 text-sm text-muted">
            {lang === "es" ? "Contacto:" : "Contact:"}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-text-secondary hover:text-gold transition-colors">
              {CONTACT_EMAIL}
            </a>
            {" · "}Pícaro Game Studio, Chile
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
