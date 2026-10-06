import type { ModuleId } from "./types";

export type IconName = "home" | "chart" | "users" | "mail" | "inbox" | "ticket" | "shield" | "list" | "image" | "chevron";

/** Nombre en español, icono y si ya está construido. Los pendientes no aparecen en el menú. */
export const MODULES: Record<ModuleId, { label: string; icon: IconName; ready: boolean }> = {
  kpis: { label: "Métricas", icon: "chart", ready: true },
  players: { label: "Jugadores", icon: "users", ready: true },
  messages: { label: "Mensajes", icon: "mail", ready: true },
  feedback: { label: "Feedback", icon: "inbox", ready: true },
  codes: { label: "Códigos", icon: "ticket", ready: true },
  photos: { label: "Fotos", icon: "image", ready: true },
  ban: { label: "Baneos", icon: "shield", ready: false },
  admins: { label: "Admins", icon: "shield", ready: true },
  audit: { label: "Auditoría", icon: "list", ready: true },
};
