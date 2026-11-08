import type { ModuleId } from "./types";

export type IconName = "home" | "chart" | "users" | "flask" | "handshake" | "mail" | "inbox" | "ticket" | "shield" | "list" | "image" | "chevron";

/** Nombre en español, icono y si ya está construido. Los pendientes no aparecen en el menú. */
export const MODULES: Record<ModuleId, { label: string; icon: IconName; ready: boolean }> = {
  kpis: { label: "Métricas", icon: "chart", ready: true },
  players: { label: "Jugadores", icon: "users", ready: true },
  playtesters: { label: "Playtesting", icon: "flask", ready: true },
  collaborators: { label: "Trabajar juntos", icon: "handshake", ready: true },
  messages: { label: "Mensajes", icon: "mail", ready: true },
  feedback: { label: "Feedback", icon: "inbox", ready: true },
  comments: { label: "Comentarios", icon: "inbox", ready: true },
  codes: { label: "Códigos", icon: "ticket", ready: true },
  photos: { label: "Fotos", icon: "image", ready: true },
  ban: { label: "Baneos", icon: "shield", ready: false },
  admins: { label: "Admins", icon: "shield", ready: true },
  audit: { label: "Auditoría", icon: "list", ready: true },
};
