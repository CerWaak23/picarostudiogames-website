"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/lib/LanguageContext";
import { CONTACT_EMAIL } from "@/lib/fitnessEraLegal";

const ACCENT = "#ff9933";

const copy = {
  es: {
    back: "Todos los juegos",
    status: "En desarrollo",
    platforms: "Android · iOS · Unity",
    tagline:
      "Tus flexiones son tus ataques. Recorre las eras de la historia peleando contra rivales con ejercicio de verdad, contado por la cámara de tu teléfono.",
    eras: [
      { img: "/games/fitness-era/prehistoria.jpg", name: "Prehistoria", sub: "Donde empieza la fuerza" },
      { img: "/games/fitness-era/antiguedad.jpg", name: "Antigüedad", sub: "Bronce, arena y disciplina" },
    ],
    aboutLabel: "El juego",
    aboutTitle: "Entrenar como jugar",
    about: [
      "Pones el teléfono en el suelo, te pones en posición y cada flexión que haces es un golpe contra tu rival. Si paras, él ataca. Si te cansas, puedes descansar sin perder la pelea.",
      "Cada era trae rivales, jefes y botín propios. Ganas oro para abrir cofres, consigues armas y equipo que te hacen más fuerte, y subes de nivel con el ejercicio que ya hiciste.",
    ],
    featuresLabel: "Características",
    featuresTitle: "Lo que lo hace distinto",
    features: [
      { title: "Tu cuerpo es el control", text: "La cámara reconoce tu postura y cuenta cada repetición bien hecha. No hace falta tocar la pantalla para pelear." },
      { title: "Eras de la historia", text: "De la Prehistoria al Futuro. Cada era tiene su arte, sus rivales y una mecánica nueva." },
      { title: "Identidad chilena", text: "Pumas, milodones y cóndores: rivales y leyendas de nuestra tierra en cada era." },
      { title: "Tres ejercicios", text: "Flexiones para atacar, saltos para curarte y sentadillas para romper escudos." },
      { title: "A tu medida", text: "Modo flexiones con rodillas y rivales de tu mismo nivel, para que cualquiera pueda empezar." },
      { title: "Cofres honestos", text: "Cada cofre muestra lo que puede salir y con qué probabilidad, y asegura una rara cada cierta cantidad." },
    ],
    privacyLabel: "Privacidad y seguridad",
    privacyTitle: "Tu imagen y tu salud, primero",
    privacyIntro:
      "Antes de jugar por primera vez, el juego te pide leer y aceptar esto. Aquí va el resumen; la política completa está en el enlace de abajo.",
    privacy: [
      { title: "Tu imagen no sale de tu teléfono", text: "La cámara solo cuenta repeticiones. No grabamos, no guardamos ni enviamos tu imagen, y nadie más la ve." },
      { title: "Datos opcionales y anónimos", text: "Tu progreso se queda en el teléfono. Compartir datos de uso anónimos es opcional y lo puedes apagar y borrar cuando quieras." },
      { title: "Tu salud primero", text: "Es un juego, no un programa médico. Si tienes alguna condición o lesión, consulta a un médico antes de jugar." },
      { title: "Juega seguro", text: "Para si sientes dolor o mareo, usa un espacio despejado con piso que no resbale y deja el teléfono estable." },
    ],
    readPolicy: "Leer la política completa",
    questions: "Dudas sobre tus datos:",
    bannerTitle: "Playtesting muy pronto",
    bannerText: "Estamos preparando las primeras pruebas en Android e iOS. Escríbenos si quieres probarlo.",
    bannerCta: "Quiero probarlo",
  },
  en: {
    back: "All Games",
    status: "In Development",
    platforms: "Android · iOS · Unity",
    tagline:
      "Your push-ups are your attacks. Travel through the eras of history fighting rivals with real exercise, counted by your phone's camera.",
    eras: [
      { img: "/games/fitness-era/prehistoria.jpg", name: "Prehistory", sub: "Where strength begins" },
      { img: "/games/fitness-era/antiguedad.jpg", name: "Antiquity", sub: "Bronze, sand and discipline" },
    ],
    aboutLabel: "The game",
    aboutTitle: "Training as play",
    about: [
      "Set your phone on the floor, get into position, and every push-up you do is a hit on your rival. If you stop, they strike back. If you get tired, you can rest without losing the fight.",
      "Each era brings its own rivals, bosses and loot. Earn gold to open chests, collect weapons and gear that make you stronger, and level up with the exercise you've already done.",
    ],
    featuresLabel: "Features",
    featuresTitle: "What makes it different",
    features: [
      { title: "Your body is the controller", text: "The camera reads your posture and counts every proper rep. No need to touch the screen to fight." },
      { title: "Eras of history", text: "From Prehistory to the Future. Each era has its own art, rivals and a new mechanic." },
      { title: "Chilean identity", text: "Pumas, mylodons and condors: rivals and legends from our land in every era." },
      { title: "Three exercises", text: "Push-ups to attack, jumping jacks to heal and squats to break shields." },
      { title: "Made for you", text: "Knee push-up mode and rivals at your own level, so anyone can get started." },
      { title: "Honest chests", text: "Every chest shows what can drop and the odds, and guarantees a rare every so often." },
    ],
    privacyLabel: "Privacy and safety",
    privacyTitle: "Your image and your health come first",
    privacyIntro:
      "Before you play for the first time, the game asks you to read and accept this. Here's the summary; the full policy is linked below.",
    privacy: [
      { title: "Your image never leaves your phone", text: "The camera only counts reps. We don't record, store or send your image, and nobody else sees it." },
      { title: "Optional, anonymous data", text: "Your progress stays on your phone. Sharing anonymous usage data is optional, and you can turn it off and delete it anytime." },
      { title: "Your health first", text: "It's a game, not a medical program. If you have any condition or injury, check with a doctor before playing." },
      { title: "Play safe", text: "Stop if you feel pain or dizziness, use a clear space with a non-slip floor and keep the phone stable." },
    ],
    readPolicy: "Read the full policy",
    questions: "Questions about your data:",
    bannerTitle: "Playtesting soon",
    bannerText: "We're getting the first tests ready on Android and iOS. Write to us if you'd like to try it.",
    bannerCta: "I want to try it",
  },
};

const privacyIcons = [
  <svg key="cam" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M3 7h3l2-3h8l2 3h3v12H3z" />
    <circle cx="12" cy="13" r="4" />
    <path d="M2 2l20 20" />
  </svg>,
  <svg key="data" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>,
  <svg key="health" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>,
  <svg key="safe" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
];

export default function FitnessEraPage() {
  const { lang } = useLang();
  const c = copy[lang];

  return (
    <div className="min-h-screen bg-bg">
      <Navbar solid />

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,153,51,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,153,51,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] max-w-full h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,153,51,0.08) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <Link
            href="/#games"
            className="inline-flex items-center gap-2 text-muted text-sm hover:text-gold transition-colors mb-10 font-mono uppercase tracking-wider"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M11 5L5 11M5 11h6M5 11V5" />
            </svg>
            {c.back}
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className="text-xs font-mono tracking-widest uppercase border px-3 py-1.5 flex items-center gap-2"
              style={{ color: ACCENT, borderColor: `${ACCENT}4d`, backgroundColor: `${ACCENT}0d` }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
              {c.status}
            </span>
            <span className="text-xs font-mono tracking-widest uppercase border border-white/8 text-muted px-3 py-1.5">
              {c.platforms}
            </span>
          </div>

          <div className="flex items-center gap-5 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/games/fitness-era/icon.png"
              alt=""
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border border-white/10 shrink-0"
            />
            <h1
              className="text-5xl md:text-7xl font-black tracking-tight text-text-primary"
              style={{ textShadow: "0 0 80px rgba(255,153,51,0.15)" }}
            >
              FITNESS <span style={{ color: ACCENT }}>ERA</span>
            </h1>
          </div>

          <p className="text-xl text-text-secondary max-w-2xl leading-relaxed">{c.tagline}</p>
        </div>
      </section>

      {/* ─── ERAS ─── */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {c.eras.map((era) => (
            <div key={era.name} className="relative border border-white/8 overflow-hidden aspect-[2.3/1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={era.img} alt={era.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <p className="text-white font-black text-xl">{era.name}</p>
                <p className="text-white/70 text-sm">{era.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>{c.aboutLabel}</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-8">{c.aboutTitle}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-text-secondary leading-relaxed text-base">
            {c.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>{c.featuresLabel}</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-12">{c.featuresTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.features.map((f) => (
              <div key={f.title} className="border border-white/8 bg-surface p-6 flex flex-col gap-3 hover:border-gold/20 transition-colors">
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: ACCENT }} />
                <h3 className="font-bold text-text-primary">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRIVACIDAD Y SEGURIDAD ─── */}
      <section id="privacidad" className="py-20 px-6 bg-surface border-t border-white/5 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>{c.privacyLabel}</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-4">{c.privacyTitle}</h2>
          <p className="text-text-secondary max-w-2xl mb-10 leading-relaxed">{c.privacyIntro}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {c.privacy.map((item, i) => (
              <div key={item.title} className="border border-white/8 bg-bg p-6 flex gap-4">
                <div className="shrink-0 mt-0.5" style={{ color: ACCENT }}>
                  {privacyIcons[i]}
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              href="/games/fitness-era/privacidad"
              className="inline-flex items-center justify-center gap-2 font-bold text-sm tracking-widest uppercase px-6 py-3 transition-opacity hover:opacity-90"
              style={{ backgroundColor: ACCENT, color: "#08080e" }}
            >
              {c.readPolicy}
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 11l6-6M11 5H5M11 5v6" />
              </svg>
            </Link>
            <p className="text-sm text-muted">
              {c.questions}{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-text-secondary hover:text-gold transition-colors">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ─── STATUS BANNER ─── */}
      <section className="py-16 px-6 border-t border-b border-white/5">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-black text-text-primary mb-2">{c.bannerTitle}</h3>
            <p className="text-text-secondary text-sm">{c.bannerText}</p>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Playtesting%20Fitness%20Era`}
            className="shrink-0 inline-flex items-center gap-2 bg-gold text-bg font-bold text-sm tracking-widest uppercase px-6 py-3 hover:bg-gold-light transition-colors"
          >
            {c.bannerCta}
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="h-px flex-1 max-w-12 bg-gold/40" />
      <span className="text-gold text-xs tracking-widest uppercase font-mono">{children}</span>
    </div>
  );
}
