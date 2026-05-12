import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const games = [
  {
    slug: "ghost-directive",
    title: "Ghost Directive",
    genre: "Tactical Stealth / Strategy",
    status: "In Development",
    statusColor: "text-gold border-gold/30 bg-gold/5",
    description:
      "A 3D top-down tactical stealth game where you command a squad of operatives. Plan every move in silence, then execute in real time.",
    tags: ["PC", "Unity", "Top-Down", "Stealth"],
    accent: "#c9a84c",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-bg pointer-events-none" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl">
          {/* Studio label */}
          <div className="inline-flex items-center gap-2 border border-gold/20 bg-gold/5 text-gold text-xs tracking-widest uppercase px-4 py-2 mb-8 font-mono">
            <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
            Indie Game Studio
          </div>

          {/* Studio logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/logo/1.1.png"
              alt="Picaro Game Studio"
              width={260}
              height={260}
              className="w-44 md:w-56 h-auto"
              style={{ filter: "invert(1)", mixBlendMode: "screen" }}
              priority
            />
          </div>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            We build games that make you think. Tactical experiences crafted
            with care — where every decision matters.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#games"
              className="inline-flex items-center gap-2 bg-gold text-bg font-bold text-sm tracking-widest uppercase px-8 py-4 hover:bg-gold-light transition-colors"
            >
              See Our Games
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 12l6-6M11 6H5M11 6v6" />
              </svg>
            </Link>
            <Link
              href="#about"
              className="inline-flex items-center gap-2 border border-white/10 text-text-secondary font-medium text-sm tracking-widest uppercase px-8 py-4 hover:border-gold/40 hover:text-text-primary transition-colors"
            >
              About Us
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted text-xs tracking-widest uppercase animate-bounce">
          <span>Scroll</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M8 3v10M3 8l5 5 5-5" />
          </svg>
        </div>
      </section>

      {/* ─── GAMES ─── */}
      <section id="games" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 max-w-12 bg-gold/40" />
              <span className="text-gold text-xs tracking-widest uppercase font-mono">
                Our Games
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-text-primary">
              Current Projects
            </h2>
          </div>

          {/* Games grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => (
              <Link key={game.slug} href={`/games/${game.slug}`}>
                <div className="group relative border border-white/8 bg-surface card-hover h-full flex flex-col">
                  {/* Placeholder image area */}
                  <div
                    className="h-52 relative overflow-hidden flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, #10101a 0%, #18182a 50%, #0f0f18 100%)`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(201,168,76,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.15) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                    />
                    {/* Diamond logo placeholder */}
                    <div
                      className="w-16 h-16 border-2 rotate-45 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity"
                      style={{ borderColor: game.accent }}
                    >
                      <div
                        className="w-4 h-4 rotate-[-45deg]"
                        style={{ backgroundColor: game.accent }}
                      />
                    </div>
                    <div className="absolute top-3 right-3 text-xs font-mono tracking-widest uppercase opacity-30 group-hover:opacity-60 transition-opacity" style={{ color: game.accent }}>
                      KEY ART SOON
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-6 flex flex-col gap-4 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-text-primary group-hover:text-gold transition-colors">
                          {game.title}
                        </h3>
                        <p className="text-sm text-muted mt-1">{game.genre}</p>
                      </div>
                      <span
                        className={`shrink-0 text-xs font-mono tracking-wide border px-2.5 py-1 ${game.statusColor}`}
                      >
                        {game.status}
                      </span>
                    </div>

                    <p className="text-text-secondary text-sm leading-relaxed">
                      {game.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {game.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-muted border border-white/8 px-2.5 py-1 font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="absolute bottom-6 right-6 text-muted group-hover:text-gold transition-colors group-hover:translate-x-1 group-hover:-translate-y-1 transform transition-transform">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M5 13L13 5M13 5H7M13 5v6" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}

            {/* Coming soon card */}
            <div className="border border-dashed border-white/8 bg-surface/50 flex items-center justify-center h-full min-h-[300px] p-12">
              <div className="text-center">
                <div className="w-10 h-10 border border-white/10 rotate-45 flex items-center justify-center mx-auto mb-4">
                  <span className="rotate-[-45deg] text-muted text-lg font-thin">+</span>
                </div>
                <p className="text-muted text-sm tracking-wider uppercase font-mono">
                  More coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-24 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px flex-1 max-w-12 bg-gold/40" />
                <span className="text-gold text-xs tracking-widest uppercase font-mono">
                  About
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-text-primary mb-6">
                Who We Are
              </h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  Picaro Game Studio is an indie game studio focused on creating
                  thoughtful, strategic experiences. We believe great games
                  reward patience, planning, and creativity.
                </p>
                <p>
                  Our debut project, <span className="text-gold font-medium">Ghost Directive</span>, is
                  a tactical stealth game where preparation is half the battle.
                  Command your squad, outsmart the enemy, and vanish like a ghost.
                </p>
                <p>
                  We&apos;re a small team with big ambitions — building every detail
                  with intention.
                </p>
              </div>
            </div>

            {/* Stats / pillars */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Games in Development", value: "1" },
                { label: "Engine", value: "Unity" },
                { label: "Genre Focus", value: "Tactical" },
                { label: "Platform", value: "PC" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border border-white/8 p-6 flex flex-col gap-2"
                >
                  <span className="text-3xl font-black text-gold">
                    {item.value}
                  </span>
                  <span className="text-xs text-muted uppercase tracking-wider font-mono">
                    {item.label}
                  </span>
                </div>
              ))}
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
              Contact
            </span>
            <div className="h-px flex-1 max-w-12 bg-gold/40" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-text-primary mb-6">
            Get in Touch
          </h2>
          <p className="text-text-secondary mb-10 text-lg">
            For press, collaborations, or just to say hi — we&apos;d love to hear
            from you.
          </p>
          <a
            href="mailto:hello@picarogamestudio.com"
            className="inline-flex items-center gap-3 border border-gold/30 bg-gold/5 text-gold text-sm tracking-widest uppercase px-8 py-4 hover:bg-gold/10 hover:border-gold/60 transition-colors font-mono"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 8l9-5 9 5v10H3V8z" />
              <path d="M3 8l9 5 9-5" />
            </svg>
            hello@picarogamestudio.com
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
