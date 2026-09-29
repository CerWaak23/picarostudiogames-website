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
          <div className="h-px flex-1 max-w-12 bg-gold/40" />
          <span className="text-gold text-xs tracking-widest uppercase font-mono">{c.label}</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-text-primary mb-6">{c.title}</h2>
        <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mb-12">{c.intro}</p>

        <div className={`grid grid-cols-1 ${hasKofi && hasMercadoPago ? "md:grid-cols-2" : ""} gap-5`}>
          {hasMercadoPago && (
            <div className="border border-white/8 bg-surface p-6 md:p-8 flex flex-col gap-5">
              <div>
                <h3 className="text-xl font-bold text-text-primary">{c.chileTitle}</h3>
                <p className="text-sm text-text-secondary mt-1">{c.chileText}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {mercadoPagoAmounts.map((a) => (
                  <a
                    key={a.label}
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center border border-gold/30 bg-gold/5 text-gold font-bold py-3 hover:bg-gold/15 hover:border-gold/60 transition-colors font-mono"
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
                  className="text-center text-sm text-text-secondary border border-white/10 py-3 hover:text-gold hover:border-gold/40 transition-colors"
                >
                  {c.other}
                </a>
              )}
              <p className="mt-auto text-xs text-muted font-mono tracking-wider uppercase">Mercado Pago</p>
            </div>
          )}

          {hasKofi && (
            <div className="border border-white/8 bg-surface p-6 md:p-8 flex flex-col gap-5">
              <div>
                <h3 className="text-xl font-bold text-text-primary">{c.worldTitle}</h3>
                <p className="text-sm text-text-secondary mt-1">{c.worldText}</p>
              </div>
              <a
                href={support.kofi}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gold text-bg font-bold text-sm tracking-widest uppercase px-6 py-4 hover:bg-gold-light transition-colors"
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
