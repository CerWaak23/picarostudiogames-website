"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SupportSection from "@/components/SupportSection";
import CollaborateSection from "@/components/CollaborateSection";
import SectionLabel from "@/components/SectionLabel";
import { useLang } from "@/lib/LanguageContext";
import { games, type Game } from "@/lib/games";

export default function Home() {
  const { tr, lang } = useLang();

  /* El juego que se muestra grande es el que está más cerca de la gente: activo
     y con arte. El resto va en una fila más liviana. Si mañana cambia cuál es,
     cambia solo. */
  const featured = games.find((g) => g.status === "active" && g.cover) ?? games[0];
  const rest = games
    .filter((g) => g !== featured)
    .sort((a, b) => (a.status === b.status ? 0 : a.status === "active" ? -1 : 1));

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <main id="contenido">
        {/* ─────────────── HÉROE ─────────────── */}
        <section className="relative min-h-[100svh] flex flex-col overflow-hidden">
          <div className="absolute inset-0 brand-glow" aria-hidden />

          {/* El arte recortado dentro de la máscara del logo. Decorativo, así
              que en teléfono no se muestra: ahí le quitaría aire al texto.
              Empieza donde termina la columna de texto (ver el grid de abajo),
              para que el lockup nunca quede encima del dibujo. */}
          {/* La máscara del logo, en piedra: relleno neutro, sin arte de ningún
              juego, porque la portada es del estudio y no de uno de ellos. El
              tinte sale del color del estilo, así que cambia con él.
              Dos máscaras encadenadas: la de afuera difumina el borde izquierdo
              para que no corte en seco contra el texto, la de adentro le da la
              forma. Una sola no alcanza. */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-0 right-0 h-full w-[38%]"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, #000 42%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 42%)",
            }}
          >
            <div className="relative h-full w-full mask-pic art-veil bg-graphite">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-ink/60" />
              <div className="absolute inset-0 halftone-strong" />
            </div>
          </div>

          {/* En teléfono, donde el arte ocupa todo el ancho, hace falta un velo
              para que el texto se lea. De `lg` arriba el arte ya está en su
              propia columna y el velo sobra. */}
          <div
            className="lg:hidden absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-transparent"
            aria-hidden
          />

          {/* La trama: encima del arte, como la trama de un impreso, pero por
              debajo del contenido. Se abre en la misma diagonal que el
              resplandor, así el degradado es de color y de puntos a la vez. */}
          <div className="absolute inset-0 halftone-strong halftone-sweep" aria-hidden />

          <div className="relative flex-1 flex items-center pt-28 pb-12">
            {/* En pantalla ancha el texto vive en el 62% izquierdo y el arte en
                el resto: son columnas, no capas, así que no pueden pisarse. */}
            <div className="max-w-6xl mx-auto w-full px-6 lg:max-w-none lg:w-[62%] lg:ml-[max(1.5rem,calc((100vw-72rem)/2))] lg:mr-0 lg:pr-0">
              <p className="rise font-mono text-[11px] sm:text-xs tracking-[0.3em] uppercase text-accent-text mb-7 sm:mb-9 flex items-center gap-3">
                <span className="w-7 h-px bg-mark" aria-hidden />
                {lang === "es" ? "Estudio indie chileno" : "Chilean indie studio"}
              </p>

              {/* El lockup del manual. Va en español en los dos idiomas. */}
              <h1 className="rise [animation-delay:60ms] mb-7 sm:mb-9">
                <span className="block font-sans font-extralight text-bone leading-[1.04] tracking-headline text-[clamp(2.1rem,7.2vw,5.3rem)]">
                  En el fin del Mundo,
                </span>
                {/* De `sm` para arriba va en una línea, como el lockup del
                    manual, y 5.6rem es lo máximo que cabe en el contenedor. En
                    teléfono forzar una línea lo dejaría en 30px, así que ahí
                    parte en dos y se agranda: tiene que pesar más que la
                    línea de arriba. */}
                <span className="block whitespace-normal sm:whitespace-nowrap font-display text-accent-text leading-[0.9] tracking-display text-[2.9rem] sm:text-[clamp(1.85rem,8.1vw,5.6rem)] lg:text-[min(5vw,4.6rem)] mt-1 sm:mt-2">
                  Inicia la Picardía.
                </span>
              </h1>

              <p className="rise [animation-delay:120ms] font-sans font-semibold text-bone text-[clamp(1.1rem,2.4vw,1.6rem)] leading-snug tracking-headline max-w-md mb-9 sm:mb-11">
                {tr.hero.promise}
              </p>

              <div className="rise [animation-delay:180ms] flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href="#games"
                  className="group inline-flex items-center gap-3 rounded-full bg-accent-fill text-accent-on font-mono text-xs sm:text-[13px] font-bold tracking-[0.18em] uppercase px-7 py-4 transition-colors duration-200 hover:bg-bone"
                >
                  {tr.hero.cta}
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.25}
                    aria-hidden
                    className="transition-transform duration-300 ease-out-quart group-hover:translate-x-1"
                  >
                    <path d="M2 7.5h11M9 3.5l4 4-4 4" />
                  </svg>
                </Link>

                <Link
                  href="#about"
                  className="font-mono text-xs tracking-[0.18em] uppercase text-bone-dim hover:text-bone transition-colors underline underline-offset-[6px] decoration-graphite-2 hover:decoration-accent"
                >
                  {tr.hero.secondary}
                </Link>
              </div>

              {/* La cápsula de datos del key visual: los dos hechos dentro de
                  una píldora, y el «+» colgando del borde de abajo. Acá el «+»
                  además sirve: es lo que baja a los juegos. */}
              <div className="rise [animation-delay:240ms] relative inline-flex mt-12 sm:mt-14 mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12 rounded-full border border-bone/15 bg-bone/[0.05] backdrop-blur-sm pl-7 pr-9 sm:pl-9 sm:pr-12 py-4 sm:py-5">
                  <Fact>{tr.hero.fact1}</Fact>
                  <Fact>{tr.hero.fact2}</Fact>
                </div>

                <Link
                  href="#games"
                  aria-label={tr.hero.scroll}
                  className="absolute left-1/2 -translate-x-1/2 -bottom-4 grid place-items-center w-9 h-9 rounded-full bg-plus text-bone transition-transform duration-300 ease-out-quart hover:scale-110"
                >
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.25} aria-hidden>
                    <path d="M6.5 1.5v10M1.5 6.5h10" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── JUEGOS ─────────────── */}
        <section id="games" className="py-20 sm:py-28 px-6 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <SectionLabel label={tr.games.label} title={tr.games.title} />
            <FeaturedGame game={featured} />

            <h3 className="font-mono text-[11px] tracking-[0.25em] uppercase text-muted mt-16 sm:mt-20 mb-6">
              {tr.games.rest}
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rest.map((g) => (
                <GameRow key={g.slug} game={g} />
              ))}
            </ul>
          </div>
        </section>

        {/* ─────────────── ESTUDIO ─────────────── */}
        <section id="about" className="py-20 sm:py-28 px-6 bg-ink-2 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <SectionLabel label={tr.about.label} title={tr.about.title} />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-start">
              <div className="space-y-5 text-bone-dim leading-relaxed text-[17px] max-w-prose">
                <p className="text-bone text-xl sm:text-2xl font-light leading-snug tracking-headline">
                  {tr.about.p1}
                </p>
                <p>
                  <Highlight text={tr.about.p2} words={["Fitness Era", "Powder & Sail", "Ghost Directive"]} />
                </p>
                <p>{tr.about.p3}</p>
              </div>

              {/* Tarjeta de la persona: una sola, no una grilla de métricas. */}
              <figure className="w-full lg:w-[320px] bg-graphite/60 border border-graphite-2 p-6">
                <div className="relative w-20 h-20 mb-5">
                  <Image
                    src="/team/andres.jpg"
                    alt=""
                    width={80}
                    height={80}
                    className="w-full h-full object-cover object-top grayscale"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-mark" aria-hidden />
                </div>
                <figcaption>
                  <p className="font-sans font-bold text-bone text-lg">Andrés Cerda Waak</p>
                  <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-accent-text mt-1.5">
                    {tr.about.role}
                  </p>
                  <p className="text-bone-dim text-sm mt-4 leading-relaxed">{tr.about.bio}</p>
                </figcaption>
                <a
                  href="https://www.instagram.com/picarogamestudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-5 font-mono text-[11px] tracking-[0.12em] text-bone-dim hover:text-accent-text transition-colors"
                >
                  <InstagramIcon />
                  @picarogamestudio
                </a>
              </figure>
            </div>
          </div>
        </section>

        <SupportSection />

        <CollaborateSection />

        {/* ─────────────── CIERRE ─────────────── */}
        <section id="contact" className="relative overflow-hidden py-20 sm:py-28 px-6 scroll-mt-20">
          <div className="absolute inset-0 halftone-strong" aria-hidden />
          <div className="relative max-w-6xl mx-auto">
            <SectionLabel label={tr.contact.label} title={tr.contact.title} />
            <p className="text-bone-dim text-lg max-w-prose mb-10">{tr.contact.description}</p>

            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:picarogamestudio@gmail.com"
                className="group inline-flex items-center gap-3 rounded-full border border-accent/50 text-accent-text font-mono text-xs tracking-[0.16em] px-6 py-4 transition-colors duration-200 hover:bg-accent-fill hover:text-accent-on"
              >
                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                  <path d="M2 4.5h13v9H2z" />
                  <path d="M2 5l6.5 4.5L15 5" />
                </svg>
                picarogamestudio@gmail.com
              </a>
              <a
                href="https://www.instagram.com/picarogamestudio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-graphite-2 text-bone-dim font-mono text-xs tracking-[0.16em] uppercase px-6 py-4 transition-colors duration-200 hover:border-bone hover:text-bone"
              >
                <InstagramIcon />
                {tr.contact.follow}
              </a>
            </div>

            {/* La página termina en la marca, no en un mailto suelto. */}
            <p
              aria-hidden
              className="mt-20 sm:mt-28 font-display text-graphite-2 leading-[0.85] tracking-display text-[clamp(2.6rem,10vw,7.5rem)] select-none"
            >
              En el fin del Mundo.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Fact({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2.5 font-mono text-[11px] sm:text-xs tracking-[0.1em] text-bone-dim">
      <span className="w-1.5 h-1.5 bg-accent shrink-0" aria-hidden />
      {children}
    </span>
  );
}

/** El juego más cerca de salir: ancho completo, con su arte. */
function FeaturedGame({ game }: { game: Game }) {
  const { tr, lang } = useLang();

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group block border border-graphite-2 bg-graphite/40 overflow-hidden transition-colors duration-300 ease-out-quart hover:border-accent/60"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
        <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[340px] overflow-hidden bg-ink">
          {game.cover && (
            <Image
              src={game.cover}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition-transform duration-[600ms] ease-out-quart group-hover:scale-[1.04]"
              priority
            />
          )}
          <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-ink/85 backdrop-blur-[2px] font-mono text-[11px] tracking-[0.22em] uppercase text-accent-text px-3 py-1.5">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" aria-hidden />
            {tr.games.featured}
          </span>
        </div>

        <div className="p-7 sm:p-10 flex flex-col justify-center gap-5">
          <div>
            <h3 className="font-display text-bone text-[clamp(2rem,4.6vw,3.4rem)] leading-[0.92] tracking-display group-hover:text-accent-text transition-colors duration-300">
              {game.title}
            </h3>
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted mt-3">
              {game.genre[lang]}
            </p>
          </div>

          <p className="text-bone-dim leading-relaxed max-w-prose">{game.description[lang]}</p>

          <ul className="flex flex-wrap gap-2">
            {game.tags.map((tag) => (
              <li
                key={tag}
                className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted border border-graphite-2 rounded-full px-3 py-1"
              >
                {tag}
              </li>
            ))}
          </ul>

          <span className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.18em] uppercase text-accent-text mt-1">
            {tr.games.open}
            <svg
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.25}
              aria-hidden
              className="transition-transform duration-300 ease-out-quart group-hover:translate-x-1"
            >
              <path d="M2 7.5h11M9 3.5l4 4-4 4" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Los demás juegos: filas, no copias del bloque de arriba. */
function GameRow({ game }: { game: Game }) {
  const { tr, lang } = useLang();
  const paused = game.status === "paused";

  return (
    <li>
      <Link
        href={`/games/${game.slug}`}
        className={`group h-full flex flex-col gap-3 border border-graphite-2 p-6 sm:p-7 transition-colors duration-300 ease-out-quart hover:border-accent/50 ${
          paused ? "bg-transparent" : "bg-graphite/30"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <h4
            className={`font-display text-[clamp(1.5rem,3vw,2.1rem)] leading-[0.95] tracking-display transition-colors duration-300 ${
              paused ? "text-bone-dim group-hover:text-bone" : "text-bone group-hover:text-accent-text"
            }`}
          >
            {game.title}
          </h4>
          <span
            className={`shrink-0 font-mono text-[11px] tracking-[0.16em] uppercase rounded-full px-3 py-1 border ${
              paused ? "text-muted border-graphite-2" : "text-accent-text border-accent/40"
            }`}
          >
            {paused ? tr.games.paused : tr.games.status}
          </span>
        </div>

        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted">
          {game.genre[lang]}
        </p>
        <p className="text-bone-dim text-sm leading-relaxed">{game.description[lang]}</p>

        {paused && (
          <p className="text-muted text-xs leading-relaxed mt-auto pt-2">{tr.games.pausedNote}</p>
        )}
      </Link>
    </li>
  );
}

/** Resalta los nombres de juego dentro de un párrafo, sin romper la traducción. */
function Highlight({ text, words }: { text: string; words: string[] }) {
  const re = new RegExp(`(${words.map((w) => w.replace(/[&]/g, "\\&")).join("|")})`, "g");
  return (
    <>
      {text.split(re).map((part, i) =>
        words.includes(part) ? (
          <span key={i} className="text-bone font-medium">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}
