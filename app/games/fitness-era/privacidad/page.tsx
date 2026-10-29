"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/lib/LanguageContext";
import { policy, POLICY_DATE, POLICY_VERSION, CONTACT_EMAIL } from "@/lib/fitnessEraLegal";

/**
 * Si te anotas en la lista de espera del playtesting (el formulario de /games/fitness-era).
 * Es algo de esta web, no del juego, así que no vive en `fitnessEraLegal.ts`: ese archivo tiene
 * que decir exactamente lo mismo que la pantalla que el jugador acepta dentro del juego.
 */
const waitlist = {
  es: {
    title: "Si te anotas en la lista de espera del playtesting",
    paragraphs: [
      "El formulario de la página de Fitness Era guarda tu correo y, si los escribes, tu nombre y la plataforma en la que quieres probarlo. Se guardan en los servidores de Unity Gaming Services (Unity Technologies), los mismos del juego.",
      "Los usamos solo para avisarte cuando abra el playtesting y para contarte cómo entrar. No te mandamos publicidad, no se los damos a nadie y no se cruzan con tu cuenta del juego: la lista de espera no sabe nada de tu progreso.",
      `Escríbenos a ${CONTACT_EMAIL} y te sacamos de la lista o te decimos qué tenemos tuyo. No hace falta explicar por qué.`,
    ],
  },
  en: {
    title: "If you join the playtesting waiting list",
    paragraphs: [
      "The form on the Fitness Era page stores your email and, if you fill them in, your name and the platform you want to play on. They're kept on Unity Gaming Services (Unity Technologies) servers, the same ones the game uses.",
      "We use them only to tell you when playtesting opens and how to get in. No marketing, we don't give them to anyone, and they're not linked to your game account: the waiting list knows nothing about your progress.",
      `Write to ${CONTACT_EMAIL} and we'll take you off the list or tell you what we have. No need to explain why.`,
    ],
  },
};

/**
 * La política completa de Fitness Era. Esta es la dirección que se entrega a Google Play y
 * a App Store Connect, y la que abre el botón «Ver política completa» dentro del juego.
 */
export default function FitnessEraPrivacyPage() {
  const { lang } = useLang();
  const p = policy[lang];

  return (
    <div className="min-h-screen bg-ink">
      <Navbar solid />

      <main className="pt-32 pb-24 px-6">
        <article className="max-w-3xl mx-auto">
          <Link
            href="/games/fitness-era#privacidad"
            className="inline-flex items-center gap-2 text-muted text-sm hover:text-accent-text transition-colors mb-10 font-mono uppercase tracking-wider"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M11 5L5 11M5 11h6M5 11V5" />
            </svg>
            Fitness Era
          </Link>

          <h1 className="font-sans font-light tracking-[-0.025em] text-[clamp(2rem,5vw,3.2rem)] text-bone tracking-tight mb-3">{p.title}</h1>
          <p className="text-sm text-muted font-mono mb-8">
            {lang === "es" ? "Versión" : "Version"} {POLICY_VERSION} · {POLICY_DATE[lang]}
          </p>
          <p className="text-lg text-bone-dim leading-relaxed mb-12">{p.intro}</p>

          <nav className="border border-graphite-2 bg-ink-2 p-6 mb-14">
            <p className="text-accent-text text-xs tracking-widest uppercase font-mono mb-3">
              {lang === "es" ? "Contenido" : "Contents"}
            </p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {p.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-bone-dim hover:text-accent-text transition-colors">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-12">
            {p.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-sans font-semibold text-bone mb-4">
                  <span className="text-accent-text font-mono text-base mr-2">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                <div className="space-y-4 text-bone-dim leading-relaxed">
                  {s.paragraphs?.map((t) => <p key={t}>{t}</p>)}
                  {s.bullets && (
                    <ul className="space-y-2">
                      {s.bullets.map((t) => (
                        <li key={t} className="flex gap-3">
                          <span className="mt-2.5 w-1.5 h-1.5 shrink-0 rotate-45 bg-accent/70" />
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

          {/* La lista de espera es de esta web, no del juego: por eso va fuera de las secciones
              de arriba, que tienen que decir lo mismo que la pantalla de consentimiento. */}
          <section id="lista-de-espera" className="mt-14 border border-graphite-2 bg-ink-2 p-6 scroll-mt-24">
            <h2 className="text-lg font-sans font-semibold text-bone mb-3">{waitlist[lang].title}</h2>
            <div className="space-y-3 text-bone-dim leading-relaxed text-sm">
              {waitlist[lang].paragraphs.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
          </section>

          <div className="mt-16 pt-8 border-t border-graphite-2 text-sm text-muted">
            {lang === "es" ? "Contacto:" : "Contact:"}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-bone-dim hover:text-accent-text transition-colors">
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
