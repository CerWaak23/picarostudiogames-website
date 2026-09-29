import type { Lang } from "./translations";

type Text = Record<Lang, string>;

export interface Game {
  slug: string;
  title: string;
  genre: Text;
  description: Text;
  tags: string[];
  platform: string;
  accent: string;
  status: "active" | "paused";
  /** Imagen de la tarjeta. Sin imagen, se muestra el marcador "KEY ART SOON". */
  cover?: string;
}

/** Los proyectos del estudio, en el orden en que salen en la portada. */
export const games: Game[] = [
  {
    slug: "ghost-directive",
    title: "Ghost Directive",
    genre: { en: "Tactical Stealth / Strategy", es: "Sigilo táctico / Estrategia" },
    description: {
      en: "A 3D top-down tactical stealth game where you command a squad of operatives. Plan every move in silence, then execute in real time.",
      es: "Un juego táctico de sigilo en 3D donde comandas un escuadrón de operativos. Planea cada movimiento en silencio y ejecútalo en tiempo real.",
    },
    tags: ["PC", "Unity", "Top-Down", "Stealth"],
    platform: "PC",
    accent: "#c9a84c",
    status: "paused",
  },
  {
    slug: "fitness-era",
    title: "Fitness Era",
    genre: { en: "Fitness RPG / Mobile", es: "RPG de ejercicio / Móvil" },
    description: {
      en: "Your push-ups are your attacks. Travel through the eras of history fighting rivals with real exercise, counted by your phone's camera.",
      es: "Tus flexiones son tus ataques. Recorre las eras de la historia peleando contra rivales con ejercicio de verdad, contado por la cámara del teléfono.",
    },
    tags: ["Android", "iOS", "Unity", "Fitness"],
    platform: "Mobile",
    accent: "#ff9933",
    status: "active",
    cover: "/games/fitness-era/prehistoria.jpg",
  },
  {
    slug: "powder-and-sail",
    title: "Powder & Sail",
    genre: { en: "Naval Roguelite / Mobile", es: "Roguelite naval / Móvil" },
    description: {
      en: "Command a pirate ship on the open sea. Clear each zone of enemies, pick upgrade cards and sail on — every run is different.",
      es: "Comanda un barco pirata en mar abierto. Despeja cada zona de enemigos, elige cartas de mejora y sigue navegando: cada partida es distinta.",
    },
    tags: ["Android", "iOS", "Unity", "Roguelite"],
    platform: "Mobile",
    accent: "#4a9fd8",
    status: "active",
  },
];
