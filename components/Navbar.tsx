"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo, Mark } from "@/components/Logo";
import { SkinChips } from "@/components/SkinSwitcher";
import { useLang } from "@/lib/LanguageContext";
import type { Lang } from "@/lib/translations";
import { hasSupport } from "@/lib/support";

/**
 * `solid`: en las páginas de cada juego la barra parte ya opaca, porque ahí
 * arriba hay portada y el texto transparente se perdería.
 */
export default function Navbar({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const { lang, setLang, tr } = useLang();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Marca en qué sección va la persona: la barra deja de ser solo decorado. */
  useEffect(() => {
    const ids = ["games", "about", "apoyar", "contact"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (seen) setActive(seen.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  /* Con el menú de teléfono abierto, la página de atrás no se mueve. */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const opaque = scrolled || solid;

  const links = [
    { href: "/#games", id: "games", label: tr.nav.games },
    { href: "/#about", id: "about", label: tr.nav.about },
    ...(hasSupport ? [{ href: "/#apoyar", id: "apoyar", label: tr.nav.support }] : []),
    { href: "/#contact", id: "contact", label: tr.nav.contact },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out-quart ${
        opaque
          ? "bg-ink/92 backdrop-blur-sm border-b border-graphite-2/70 py-3"
          : "border-b border-transparent py-5"
      }`}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6 flex items-center justify-between gap-6">
        {/* Arriba del todo cabe el lockup completo. Al encogerse la barra, el
            lockup de tres líneas quedaría ilegible, así que queda la máscara,
            que es lo que se reconoce en chico. */}
        <Link
          href="/"
          aria-label="Pícaro Game Studio"
          className="group transition-opacity hover:opacity-80"
          onClick={() => setMenuOpen(false)}
        >
          {opaque ? (
            <Mark height={30} className="bg-bone group-hover:bg-accent transition-colors duration-300" />
          ) : (
            <Logo height={56} className="bg-bone group-hover:bg-accent transition-colors duration-300" />
          )}
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <NavLink key={l.id} href={l.href} active={active === l.id}>
              {l.label}
            </NavLink>
          ))}
          <span className="w-px h-4 bg-graphite-2" aria-hidden />
          <LangToggle lang={lang} setLang={setLang} />
          <AdminLink />
        </div>

        <button
          className="md:hidden text-bone p-2 -mr-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.75}>
            {menuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M3 7h18M3 17h18" />}
          </svg>
        </button>
      </div>

      {/* En teléfono el menú ocupa la pantalla: cada opción es un blanco grande.
          Cubre todo y el logo queda encima (la fila de arriba lleva z-10): con
          un `top` fijo el panel le cortaba las patas al logo, que cambia de
          alto según si la barra está encogida o no. */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-ink halftone flex flex-col pt-24">
          <div className="flex flex-col px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.id}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="font-sans text-3xl font-light tracking-headline text-bone py-4 border-b border-graphite-2/60 active:text-accent-text"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto px-6 py-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted">
                Estilo
              </span>
              <SkinChips />
            </div>
            <div className="flex items-center justify-between">
              <LangToggle lang={lang} setLang={setLang} />
              <AdminLink />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={`relative font-mono text-[12px] tracking-[0.18em] uppercase transition-colors duration-200 ${
        active ? "text-accent-text" : "text-bone-dim hover:text-bone"
      }`}
    >
      {children}
      <span
        aria-hidden
        className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300 ease-out-quart ${
          active ? "w-full" : "w-0"
        }`}
      />
    </Link>
  );
}

/** Acceso al panel del estudio: discreto a propósito. Lo protege el login de Google. */
function AdminLink() {
  return (
    <a
      href="https://admin.picarogamestudio.com"
      rel="noopener noreferrer"
      className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted hover:text-accent-text transition-colors"
    >
      Admin
    </a>
  );
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center font-mono text-[11px] tracking-[0.2em]">
      {(["es", "en"] as const).map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="text-graphite-2 px-1.5">/</span>}
          <button
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`uppercase transition-colors ${
              lang === l ? "text-accent-text" : "text-muted hover:text-bone"
            }`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
