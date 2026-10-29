export type Lang = "en" | "es";

/**
 * El lockup del manual («En el fin del Mundo, / INICIA LA PICARDÍA.») no está
 * aquí a propósito: es firma de marca, no copy, y va en español en los dos
 * idiomas. Vive en app/page.tsx.
 */
export const t = {
  en: {
    nav: {
      games: "Games",
      about: "Studio",
      contact: "Contact",
      support: "Support",
    },
    hero: {
      promise: "Clever games, with humour and cunning.",
      cta: "See the games",
      secondary: "Who's behind this",
      fact1: "Games born out of our own history.",
      fact2: "100% made in Chile.",
      scroll: "Scroll",
    },
    games: {
      label: "The games",
      title: "What we're building",
      featured: "Closest to release",
      rest: "Also in the workshop",
      open: "Open the game",
      status: "In development",
      paused: "On hold",
      pausedNote: "Parked while the mobile games ship. It will come back.",
    },
    about: {
      label: "The studio",
      title: "Who's behind this",
      p1: "Pícaro Game Studio is a one-person indie studio in Chile. Every game starts as an idea that seemed too good to leave alone.",
      p2: "Right now there are two mobile games in the works: Fitness Era, where real push-ups power every fight, and Powder & Sail, a pirate roguelite on the open sea. Ghost Directive, the first project, is on hold.",
      p3: "We take after Chile's stories and its picardía: wit with a wink, where the smartest player wins. Small studio, few resources, plenty of ideas.",
      role: "Founder & developer",
      bio: "Designer, developer and creative director behind Pícaro. Making games from the end of the world.",
    },
    contact: {
      label: "Contact",
      title: "Say hello",
      description: "Press, collaborations, or just to talk about games.",
      mail: "Write to us",
      follow: "Follow the studio",
    },
    footer: {
      rights: "All rights reserved.",
      made: "Made with picardía in Chile",
    },
  },
  es: {
    nav: {
      games: "Juegos",
      about: "Estudio",
      contact: "Contacto",
      support: "Apoyar",
    },
    hero: {
      promise: "Juegos ingeniosos, con humor y astucia.",
      cta: "Ver los juegos",
      secondary: "Quién está detrás",
      fact1: "Juegos que nacen de nuestra historia.",
      fact2: "Desarrollo 100% Chileno.",
      scroll: "Bajar",
    },
    games: {
      label: "Los juegos",
      title: "En qué estamos",
      featured: "Lo más cerca de salir",
      rest: "También en el taller",
      open: "Conocer el juego",
      status: "En desarrollo",
      paused: "En pausa",
      pausedNote: "Guardado mientras salen los juegos de celular. Vuelve.",
    },
    about: {
      label: "El estudio",
      title: "Quién está detrás",
      p1: "Pícaro Game Studio es un estudio indie chileno de una persona. Cada juego parte de una idea que daba pena dejar botada.",
      p2: "Ahora hay dos juegos de celular en obra: Fitness Era, donde las flexiones de verdad mueven cada pelea, y Powder & Sail, un roguelite pirata en mar abierto. Ghost Directive, el primer proyecto, está en pausa.",
      p3: "Nos salen las historias y la picardía de Chile: ingenio con humor, donde gana el más astuto. Estudio chico, pocos recursos, ideas de sobra.",
      role: "Fundador y desarrollador",
      bio: "Diseñador, desarrollador y director creativo detrás de Pícaro. Haciendo juegos desde el fin del mundo.",
    },
    contact: {
      label: "Contacto",
      title: "Escríbenos",
      description: "Prensa, colaboraciones, o simplemente para hablar de juegos.",
      mail: "Escribir al estudio",
      follow: "Seguir al estudio",
    },
    footer: {
      rights: "Todos los derechos reservados.",
      made: "Hecho con picardía en Chile",
    },
  },
} as const;
