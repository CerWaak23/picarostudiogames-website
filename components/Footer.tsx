"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useLang } from "@/lib/LanguageContext";

/** Solo las redes que existen de verdad. Un icono que no lleva a ningún lado resta. */
const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/picarogamestudio",
    icon: (
      <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { tr } = useLang();

  return (
    <footer className="border-t border-graphite-2 bg-ink py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <Link href="/" aria-label="Pícaro Game Studio" className="group">
            <Logo height={32} className="bg-bone-dim transition-colors duration-300 group-hover:bg-accent" />
          </Link>

          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                /* Los iconos van en círculo, como en la firma de correo del manual. */
                className="grid place-items-center w-9 h-9 rounded-full border border-graphite-2 text-bone-dim hover:bg-accent-fill hover:text-accent-on hover:border-transparent transition-colors"
              >
                {s.icon}
              </a>
            ))}
            <a
              href="mailto:picarogamestudio@gmail.com"
              aria-label="Correo"
              /* Los iconos van en círculo, como en la firma de correo del manual. */
                className="grid place-items-center w-9 h-9 rounded-full border border-graphite-2 text-bone-dim hover:bg-accent-fill hover:text-accent-on hover:border-transparent transition-colors"
            >
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                <path d="M2 4.5h13v9H2z" />
                <path d="M2 5l6.5 4.5L15 5" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-9 pt-6 border-t border-graphite-2/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[11px] tracking-[0.1em] text-muted">
          <p>© {new Date().getFullYear()} Pícaro Game Studio. {tr.footer.rights}</p>
          <p className="flex items-center gap-2">
            {tr.footer.made}
            <span className="w-1.5 h-1.5 bg-mark inline-block" aria-hidden />
          </p>
        </div>
      </div>
    </footer>
  );
}
