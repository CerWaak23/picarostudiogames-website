import type { ProjectConfig } from "@/lib/types";

/**
 * Mar Bravo (Unity Gaming Services). En el panel de Unity el proyecto todavía se llama "Powder & Sail". El id de proyecto no es
 * secreto (sale de ProjectSettings del juego); el del entorno "production" sale de Unity Dashboard → Environments.
 * Los scripts viven en el repo del juego: Mar Bravo/Cloud/scripts.
 */
export const marbravo: ProjectConfig = {
  id: "marbravo",
  name: "Mar Bravo",
  views: "marbravo",
  backend: {
    type: "ugs",
    projectId: process.env.UGS_MARBRAVO_PROJECT_ID ?? "da5501f9-3fa3-4016-ab3e-bbf224366830",
    environmentId: process.env.UGS_MARBRAVO_ENV_ID ?? "",
    credsEnv: "UGS_MARBRAVO",
    actions: {
      "players.summary": { script: "Jugadores", params: { action: "resumen" } },
      "players.search": { script: "Jugadores", params: { action: "buscar" } },
      "players.view": { script: "Jugadores", params: { action: "ver" } },
      "comments.list": { script: "Jugadores", params: { action: "reportes" } },
      "comments.done": { script: "Jugadores", params: { action: "revisado" } },
    },
  },
  modules: ["kpis", "players", "comments"],
  roles: {
    "picarogamestudio@gmail.com": "owner",
    "andrescerdawaak@gmail.com": "owner",
  },
};
