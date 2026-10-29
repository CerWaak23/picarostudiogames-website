"use client";

import { useLang } from "@/lib/LanguageContext";
import { support, mercadoPagoAmounts, hasKofi, hasMercadoPago, hasSupport } from "@/lib/support";

const copy = {
  es: {
    label: "Apoyar",
    title: "Apoya al estudio",
    intro:
      "Pícaro es un estudio indie pequeño, hecho en Chile. Si te gustan nuestros juegos y quieres que sigan saliendo, puedes aportar con lo que quieras. Cada aporte va directo al desarrollo.",
    chileTitle: "Desde Chile",
    chileText: "En pesos, con tarjeta, débito o saldo de Mercado Pago.",
    other: "Otro monto",
    worldTitle: "Desde cualquier país",
    worldText: "Con PayPal o tarjeta a través de Ko-fi, en tu moneda.",
    kofi: "Apoyar en Ko-fi",
    note: "Los aportes son voluntarios y no incluyen productos ni recompensas dentro de los juegos. El pago lo procesa Mercado Pago o Ko-fi: nuestra web no ve ni guarda tus datos de pago.",
  },
  en: {
    label: "Support",
    title: "Support the studio",
    intro:
      "Pícaro is a small indie studio, made in Chile. If you enjoy our games and want to see more of them, you can chip in whatever you like. Every contribution goes straight into development.",
    chileTitle: "From Chile",
    chileText: "In Chilean pesos, with card, debit or Mercado Pago balance.",
    other: "Other amount",
    worldTitle: "From anywhere",
    worldText: "With PayPal or card through Ko-fi, in your currency.",
    kofi: "Support on Ko-fi",
    note: "Contributions are voluntary and don't include products or in-game rewards. Payments are processed by Mercado Pago or Ko-fi: our site never sees or stores your payment details.",
  },
};

/** Sección de donaciones. No se muestra hasta que haya al menos un enlace en lib/support.ts. */
export default function SupportSection() {
  const { lang } = useLang();
  if (!hasSupport) return null;
  const c = copy[lang];

  return (
    <section id="apoyar" className="py-24 px-6 scroll-mt-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 max-w-12 bg-accent/40" />
          <span className="text-accent-text text-xs tracking-widest uppercase font-mono">{c.label}</span>
        </div>
        <h2 className="font-sans font-light tracking-[-0.025em] text-[clamp(2rem,5.2vw,3.6rem)] text-bone mb-6">{c.title}</h2>
        <p className="text-bone-dim text-lg leading-relaxed max-w-2xl mb-12">{c.intro}</p>

        <div className={`grid grid-cols-1 ${hasKofi && hasMercadoPago ? "md:grid-cols-2" : ""} gap-5`}>
          {hasMercadoPago && (
            <div className="border border-graphite-2 bg-ink-2 p-6 md:p-8 flex flex-col gap-5">
              <div>
                <h3 className="text-xl font-sans font-semibold text-bone">{c.chileTitle}</h3>
                <p className="text-sm text-bone-dim mt-1">{c.chileText}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {mercadoPagoAmounts.map((a) => (
                  <a
                    key={a.label}
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center rounded-full border border-accent/30 bg-accent/5 text-accent-text font-mono font-bold py-3 hover:bg-accent/15 hover:border-accent/60 transition-colors font-mono"
                  >
                    {a.label}
                  </a>
                ))}
              </div>
              {support.mercadoPago.other && (
                <a
                  href={support.mercadoPago.other}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-sm text-bone-dim rounded-full border border-graphite-2 py-3 hover:text-accent-text hover:border-accent/40 transition-colors"
                >
                  {c.other}
                </a>
              )}
              <p className="mt-auto text-xs text-muted font-mono tracking-wider uppercase">Mercado Pago</p>
            </div>
          )}

          {hasKofi && (
            <div className="border border-graphite-2 bg-ink-2 p-6 md:p-8 flex flex-col gap-5">
              <div>
                <h3 className="text-xl font-sans font-semibold text-bone">{c.worldTitle}</h3>
                <p className="text-sm text-bone-dim mt-1">{c.worldText}</p>
              </div>
              <a
                href={support.kofi}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-fill text-accent-on font-mono font-bold text-xs tracking-[0.18em] uppercase px-6 py-4 hover:bg-bone transition-colors"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M3 7h11v5a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7z" />
                  <path d="M14 8h1.5a2.5 2.5 0 0 1 0 5H14" />
                </svg>
                {c.kofi}
              </a>
              <p className="mt-auto text-xs text-muted font-mono tracking-wider uppercase">Ko-fi · PayPal</p>
            </div>
          )}
        </div>

        <p className="text-xs text-muted leading-relaxed mt-8 max-w-2xl">{c.note}</p>
      </div>
    </section>
  );
}
