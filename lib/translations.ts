export type Lang = "en" | "es";

export const t = {
  en: {
    nav: {
      games: "Games",
      about: "About",
      contact: "Contact",
    },
    hero: {
      badge: "Indie Game Studio",
      tagline: "We build games that make you think. Tactical experiences crafted with care — where every decision matters.",
      cta: "See Our Games",
      about: "About Us",
      scroll: "Scroll",
    },
    games: {
      sectionLabel: "Our Games",
      sectionTitle: "Current Projects",
      status: "In Development",
      comingSoon: "More coming soon",
      ghostDescription: "A 3D top-down tactical stealth game where you command a squad of operatives. Plan every move in silence, then execute in real time.",
    },
    about: {
      sectionLabel: "About",
      title: "Who We Are",
      p1: "Picaro Game Studio is an indie game studio focused on creating thoughtful, strategic experiences. We believe great games reward patience, planning, and creativity.",
      p2: "Our debut project, Ghost Directive, is a tactical stealth game where preparation is half the battle. Command your squad, outsmart the enemy, and vanish like a ghost.",
      p3: "We're a small studio with big ambitions — building every detail with intention and passion for the craft.",
      stat1: "Games in Dev",
      stat2: "Engine",
      stat3: "Genre Focus",
      stat4: "Platform",
      role: "Founder & Game Developer",
      bio: "Designer, developer, and creative director behind Picaro Game Studio. Building tactical games from Chile.",
    },
    contact: {
      sectionLabel: "Contact",
      title: "Get in Touch",
      description: "For press, collaborations, or just to say hi — we'd love to hear from you.",
    },
    footer: {
      rights: "All rights reserved.",
      made: "Made with passion in Chile",
    },
  },
  es: {
    nav: {
      games: "Juegos",
      about: "Nosotros",
      contact: "Contacto",
    },
    hero: {
      badge: "Estudio de Videojuegos Indie",
      tagline: "Hacemos juegos que te hacen pensar. Experiencias tácticas construidas con cuidado — donde cada decisión importa.",
      cta: "Ver Nuestros Juegos",
      about: "Sobre Nosotros",
      scroll: "Bajar",
    },
    games: {
      sectionLabel: "Nuestros Juegos",
      sectionTitle: "Proyectos Actuales",
      status: "En Desarrollo",
      comingSoon: "Más próximamente",
      ghostDescription: "Un juego táctico de sigilo en 3D donde comandas un escuadrón de operativos. Planea cada movimiento en silencio y ejecútalo en tiempo real.",
    },
    about: {
      sectionLabel: "Nosotros",
      title: "Quiénes Somos",
      p1: "Picaro Game Studio es un estudio indie enfocado en crear experiencias estratégicas y reflexivas. Creemos que los grandes juegos recompensan la paciencia, la planificación y la creatividad.",
      p2: "Nuestro primer proyecto, Ghost Directive, es un juego de sigilo táctico donde la preparación es la mitad de la batalla. Comanda tu escuadrón, supera al enemigo y desaparece como un fantasma.",
      p3: "Somos un estudio pequeño con grandes ambiciones — construyendo cada detalle con intención y pasión.",
      stat1: "Juegos en Dev",
      stat2: "Motor",
      stat3: "Género",
      stat4: "Plataforma",
      role: "Fundador & Desarrollador",
      bio: "Diseñador, desarrollador y director creativo detrás de Picaro Game Studio. Creando juegos tácticos desde Chile.",
    },
    contact: {
      sectionLabel: "Contacto",
      title: "Escríbenos",
      description: "Para prensa, colaboraciones o simplemente saludar — nos encantaría saber de ti.",
    },
    footer: {
      rights: "Todos los derechos reservados.",
      made: "Hecho con pasión en Chile",
    },
  },
} as const;
