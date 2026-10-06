import { after } from "next/server";
import { getProject } from "@/projects";
import { backendFor } from "./backends";

/**
 * Registro de auditoría: quién hizo qué, en qué juego y cuándo. Va a los logs de Vercel (una línea
 * JSON por evento) y, si el juego lo soporta ("audit.record"), también se guarda de forma
 * permanente en su backend para verlo en la pantalla Auditoría.
 */
export interface AuditEvent {
  who: string;
  project: string;
  action: string;
  target?: string;
  detail?: Record<string, unknown>;
}

/** Lo que solo mira, sin cambiar nada. La pantalla Auditoría las esconde por defecto. */
const READ = /\.(search|view|summary|list|results|data|count)$/;
export const isReadAction = (action: string) => READ.test(action);

export function audit(e: AuditEvent) {
  const kind = isReadAction(e.action) ? "read" : "write";
  console.log(JSON.stringify({ type: "audit", at: new Date().toISOString(), kind, ...e }));

  const project = getProject(e.project);
  if (!project || !project.backend.actions["audit.record"]) return;
  try {
    // after(): se ejecuta cuando ya respondimos, sin hacer esperar al usuario y sin que Vercel lo corte.
    after(async () => {
      try {
        const res = await backendFor(project).call({ action: "audit.record", params: { event: { ...e, kind } } });
        const body = res.data as { ok?: boolean; reason?: string } | undefined;
        if (!res.ok || body?.ok === false) console.error("audit: no se pudo guardar", res.error ?? body?.reason);
      } catch (err) {
        console.error("audit: error al guardar", err instanceof Error ? err.message : err);
      }
    });
  } catch {
    /* fuera de una petición (no debería pasar): queda solo en los logs */
  }
}
