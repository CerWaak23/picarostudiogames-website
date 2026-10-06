import { PROJECTS, getProject } from "@/projects";
import type { ProjectConfig, Role } from "./types";

const norm = (email?: string | null) => (email ?? "").trim().toLowerCase();

/** Correos con acceso a al menos un juego. Cualquier otro se rechaza al iniciar sesión. */
export function isAllowedEmail(email?: string | null): boolean {
  const e = norm(email);
  return !!e && PROJECTS.some((p) => Object.keys(p.roles).some((k) => norm(k) === e));
}

export function roleFor(email: string | null | undefined, project: ProjectConfig): Role | null {
  const e = norm(email);
  for (const [k, r] of Object.entries(project.roles)) if (norm(k) === e) return r;
  return null;
}

/** Juegos que este correo puede ver, con su rol. */
export function projectsFor(email?: string | null): { project: ProjectConfig; role: Role }[] {
  return PROJECTS.flatMap((project) => {
    const role = roleFor(email, project);
    return role ? [{ project, role }] : [];
  });
}

/** Para usar en cada página y acción de servidor: devuelve el rol o corta. */
export function requireAccess(email: string | null | undefined, projectId: string, need: Role = "viewer") {
  const project = getProject(projectId);
  if (!project) throw new Error("Juego desconocido");
  const role = roleFor(email, project);
  if (!role) throw new Error("Sin acceso a este juego");
  if (need === "owner" && role !== "owner") throw new Error("Esta acción es solo para owners");
  return { project, role };
}
