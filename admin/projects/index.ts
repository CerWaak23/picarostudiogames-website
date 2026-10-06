import type { ProjectConfig } from "@/lib/types";
import { fitnessera } from "./fitnessera";

/** Para sumar un juego: crea projects/<juego>.ts y agrégalo aquí. */
export const PROJECTS: ProjectConfig[] = [fitnessera];

export function getProject(id: string): ProjectConfig | undefined {
  return PROJECTS.find((p) => p.id === id);
}
