export type Lang = "en" | "es";

export const t = {
  en: {
    nav: {
      games: "Games",
      about: "About",
      contact: "Contact",
      support: "Support",
    },
    hero: {
      badge: "Indie Game Studio · Chile",
      tagline: "We make games with wit and picardía — and along the way, we share a bit of Chile with the world.",
      cta: "See Our Games",
      about: "About Us",
      scroll: "Scroll",
    },
    games: {
      sectionLabel: "Our Games",
      sectionTitle: "Current Projects",
      status: "In Development",
      paused: "On Hold",
      comingSoon: "More coming soon",
      ghostDescription: "A 3D top-down tactical stealth game where you command a squad of operatives. Plan every move in silence, then execute in real time.",
    },
    about: {
      sectionLabel: "About",
      title: "Who We Are",
      p1: "Pícaro Game Studio is a Chilean indie studio. We make games with our own ideas and a lot of love for the craft.",
      p2: "Today we're building two mobile games: Fitness Era, where real exercise powers every fight, and Powder & Sail, a pirate roguelite on the open sea. Our first project, Ghost Directive, a tactical stealth game, is currently on hold.",
      p3: "We're inspired by Chile's stories and its picardía — our word for wit with a wink — and we love sharing a bit of that with the world. We're a small studio, and what we lack in budget we make up for with ideas.",
      stat1: "Games",
      stat2: "Engine",
      stat3: "Our Signature",
      stat4: "Platforms",
      role: "Founder & Game Developer",
      bio: "Designer, developer, and creative director behind Pícaro Game Studio. Building games from Chile, at the end of the world.",
    },
    contact: {
      sectionLabel: "Contact",
      title: "Get in Touch",
      description: "For press, collaborations, or just to say hi — we'd love to hear from you.",
    },
    footer: {
      rights: "All rights reserved.",
      made: "Made with picardía in Chile",
    },
  },
  es: {
    nav: {
      games: "Juegos",
      about: "Nosotros",
      contact: "Contacto",
      support: "Apoyar",
    },
    hero: {
      badge: "Estudio Indie Chileno",
      tagline: "Hacemos juegos con ingenio y picardía, y en el camino mostramos un poco de Chile al mundo.",
      cta: "Ver Nuestros Juegos",
      about: "Sobre Nosotros",
      scroll: "Bajar",
    },
    games: {
      sectionLabel: "Nuestros Juegos",
      sectionTitle: "Proyectos Actuales",
      status: "En Desarrollo",
      paused: "En Pausa",
      comingSoon: "Más próximamente",
      ghostDescription: "Un juego táctico de sigilo en 3D donde comandas un escuadrón de operativos. Planea cada movimiento en silencio y ejecútalo en tiempo real.",
    },
    about: {
      sectionLabel: "Nosotros",
      title: "Quiénes Somos",
      p1: "Pícaro Game Studio es un estudio indie chileno. Hacemos juegos con ideas propias y mucho cariño por el oficio.",
      p2: "Hoy estamos creando dos juegos para celular: Fitness Era, donde el ejercicio de verdad mueve cada pelea, y Powder & Sail, un roguelite pirata en mar abierto. Nuestro primer proyecto, Ghost Directive, un juego de sigilo táctico, está en pausa.",
      p3: "Nos inspiran las historias y la picardía de Chile, y nos gusta llevar un poco de eso al mundo. Somos un estudio pequeño, y lo que no tenemos en presupuesto lo compensamos con ideas.",
      stat1: "Juegos",
      stat2: "Motor",
      stat3: "Sello",
      stat4: "Plataformas",
      role: "Fundador & Desarrollador",
      bio: "Diseñador, desarrollador y director creativo detrás de Pícaro Game Studio. Creando juegos desde Chile, en el fin del mundo.",
    },
    contact: {
      sectionLabel: "Contacto",
      title: "Escríbenos",
      description: "Para prensa, colaboraciones o simplemente saludar — nos encantaría saber de ti.",
    },
    footer: {
      rights: "Todos los derechos reservados.",
      made: "Hecho con picardía en Chile",
    },
  },
} as const;
