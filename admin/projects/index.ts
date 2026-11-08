import type { ProjectConfig } from "@/lib/types";
import { fitnessera } from "./fitnessera";
import { estudio } from "./estudio";
import { marbravo } from "./marbravo";

/** Para sumar un juego: crea projects/<juego>.ts y agrégalo aquí. */
export const PROJECTS: ProjectConfig[] = [fitnessera, marbravo, estudio];

export function getProject(id: string): ProjectConfig | undefined {
  return PROJECTS.find((p) => p.id === id);
}
