"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import type { Lang } from "@/lib/translations";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, tr } = useLang();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const dark = !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/95 backdrop-blur-md border-b border-white/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`text-2xl font-black tracking-tight transition-colors ${
            dark ? "text-gray-900 hover:text-gray-600" : "text-white hover:text-gold"
          }`}
        >
          Pícaro
        </Link>

        {/* Desktop links + lang switcher */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/#games" dark={dark}>{tr.nav.games}</NavLink>
          <NavLink href="/#about" dark={dark}>{tr.nav.about}</NavLink>
          <NavLink href="/#contact" dark={dark}>{tr.nav.contact}</NavLink>
          <LangToggle lang={lang} setLang={setLang} dark={dark} />
        </div>

        {/* Mobile burger */}
        <button
          className={`md:hidden transition-colors ${dark ? "text-gray-700 hover:text-gray-900" : "text-text-secondary hover:text-gold"}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          <NavLink href="/#games" onClick={() => setMenuOpen(false)}>{tr.nav.games}</NavLink>
          <NavLink href="/#about" onClick={() => setMenuOpen(false)}>{tr.nav.about}</NavLink>
          <NavLink href="/#contact" onClick={() => setMenuOpen(false)}>{tr.nav.contact}</NavLink>
          <LangToggle lang={lang} setLang={setLang} />
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href, children, onClick, dark,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  dark?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm transition-colors tracking-wide uppercase font-medium ${
        dark ? "text-gray-700 hover:text-gray-900" : "text-text-secondary hover:text-gold"
      }`}
    >
      {children}
    </Link>
  );
}

function LangToggle({ lang, setLang, dark }: { lang: Lang; setLang: (l: Lang) => void; dark?: boolean }) {
  const base = `text-xs font-mono font-bold tracking-widest px-2 py-1 transition-colors`;
  const active = dark ? "text-gray-900 border-b-2 border-gray-700" : "text-gold border-b-2 border-gold";
  const inactive = dark ? "text-gray-400 hover:text-gray-700" : "text-muted hover:text-text-secondary";

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => setLang("es")} className={`${base} ${lang === "es" ? active : inactive}`}>
        ES
      </button>
      <span className={`text-xs ${dark ? "text-gray-400" : "text-muted"}`}>/</span>
      <button onClick={() => setLang("en")} className={`${base} ${lang === "en" ? active : inactive}`}>
        EN
      </button>
    </div>
  );
}
