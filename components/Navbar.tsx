"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

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
        <Link href="/" className="flex items-center group">
          <div style={{ mixBlendMode: "screen" }}>
            <Image
              src="/logo/3.png"
              alt="Picaro Game Studio"
              width={160}
              height={50}
              className="h-10 w-auto object-contain transition-opacity group-hover:opacity-80"
              style={{ filter: "invert(1) contrast(8)" }}
              priority
            />
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/#games">Games</NavLink>
          <NavLink href="/#about">About</NavLink>
          <NavLink href="/#contact">Contact</NavLink>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-text-secondary hover:text-gold transition-colors"
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
          <NavLink href="/#games" onClick={() => setMenuOpen(false)}>Games</NavLink>
          <NavLink href="/#about" onClick={() => setMenuOpen(false)}>About</NavLink>
          <NavLink href="/#contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-sm text-text-secondary hover:text-gold transition-colors tracking-wide uppercase font-medium"
    >
      {children}
    </Link>
  );
}
