import type { ProjectConfig } from "@/lib/types";

/**
 * Fitness Era (Unity Gaming Services). Los IDs de proyecto y entorno no son secretos, pero salen de
 * Unity Dashboard → Project Settings; complétalos antes de usar el panel.
 */
export const fitnessera: ProjectConfig = {
  id: "fitnessera",
  name: "Fitness Era",
  backend: {
    type: "ugs",
    projectId: process.env.UGS_FITNESSERA_PROJECT_ID ?? "",
    environmentId: process.env.UGS_FITNESSERA_ENV_ID ?? "",
    credsEnv: "UGS_FITNESSERA",
    // Se completa módulo a módulo; los nombres son los scripts de FitnessEra/Cloud/scripts.
    actions: {
      "players.summary": { script: "Jugadores", params: { action: "resumen" } },
      "players.search": { script: "Jugadores", params: { action: "buscar" } },
      "players.view": { script: "Jugadores", params: { action: "ver" } },
      "players.ban": { script: "Jugadores", params: { action: "banear" } },
      "players.hide": { script: "Jugadores", params: { action: "quitar" } },
      "players.show": { script: "Jugadores", params: { action: "mostrar" } },
      "players.gift": { script: "Jugadores", params: { action: "regalar" } },
      "players.admin": { script: "Jugadores", params: { action: "admin" } },
      "players.reset": { script: "Jugadores", params: { action: "reiniciar" } },
      "players.restore": { script: "Jugadores", params: { action: "recuperar" } },
      "codes.create": { script: "Codigos", params: { action: "crear" } },
      "codes.list": { script: "Codigos", params: { action: "lista" } },
      "codes.pause": { script: "Codigos", params: { action: "pausar" } },
      "messages.send": { script: "Mensajes", params: { action: "enviar" } },
      "messages.list": { script: "Mensajes", params: { action: "lista" } },
      "messages.results": { script: "Mensajes", params: { action: "resultados" } },
      "messages.delete": { script: "Mensajes", params: { action: "borrar" } },
      "feedback.list": { script: "Mensajes", params: { action: "ver_feedback" } },
      "feedback.done": { script: "Mensajes", params: { action: "feedback_revisado" } },
      "reports.list": { script: "Mensajes", params: { action: "ver_reportes" } },
      "reports.data": { script: "Mensajes", params: { action: "reporte_datos" } },
      "reports.done": { script: "Mensajes", params: { action: "reporte_revisado" } },
    },
  },
  modules: ["kpis", "players", "ban", "codes", "messages", "feedback", "admins", "audit"],
  roles: {
    "picarogamestudio@gmail.com": "owner",
  },
};
