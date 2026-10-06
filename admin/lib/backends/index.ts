import type { Backend, ProjectConfig } from "../types";
import { ugsBackend } from "./ugs";

/** Un adaptador por tipo de backend. Para otro (http, playfab…) agrega un caso aquí. */
export function backendFor(project: ProjectConfig): Backend {
  switch (project.backend.type) {
    case "ugs":
      return ugsBackend(project.backend);
  }
}
