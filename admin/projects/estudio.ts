import type { ProjectConfig } from "@/lib/types";

/**
 * El estudio, no un juego: lo que llega por la web de Pícaro y no es de un título en particular.
 * Hoy es solo «Trabajar juntos» (el formulario de la home).
 *
 * Usa el mismo proyecto de Unity que Fitness Era porque es el único que hay, y las mismas llaves.
 * Los datos viven en su propio custom item (`colaboradores`), aparte de los del juego. Si algún
 * día el estudio tiene su propio proyecto en Unity, se cambian estas tres líneas y nada más.
 */
export const estudio: ProjectConfig = {
  id: "estudio",
  name: "Pícaro Game Studio",
  backend: {
    type: "ugs",
    projectId: process.env.UGS_FITNESSERA_PROJECT_ID ?? "",
    environmentId: process.env.UGS_FITNESSERA_ENV_ID ?? "",
    credsEnv: "UGS_FITNESSERA",
    actions: {
      "collaborators.list": { script: "Colaboradores", params: { action: "lista" } },
      "collaborators.done": { script: "Colaboradores", params: { action: "revisado" } },
      "audit.record": { script: "Auditoria", params: { action: "registrar" } },
    },
  },
  modules: ["collaborators"],
  roles: {
    "picarogamestudio@gmail.com": "owner",
  },
};
