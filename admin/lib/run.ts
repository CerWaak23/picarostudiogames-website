import { auth } from "@/auth";
import { requireAccess } from "./access";
import { backendFor } from "./backends";
import { audit } from "./audit";
import type { Role } from "./types";

export type Outcome<T = unknown> = { ok: boolean; message: string; data?: T };

/**
 * Camino único de toda acción o lectura del panel: sesión válida, rol suficiente, llamada al
 * backend y auditoría con el resultado. `log: false` para lecturas ruidosas.
 */
export async function runAdmin<T = unknown>(
  projectId: string,
  action: string,
  params: Record<string, unknown>,
  opts: { need?: Role; target?: string; detail?: Record<string, unknown>; log?: boolean } = {},
): Promise<Outcome<T>> {
  try {
    const session = await auth();
    const email = session?.user?.email ?? undefined;
    const { project } = requireAccess(email, projectId, opts.need ?? "viewer");
    const res = await backendFor(project).call({ action, params });
    const body = res.data as { ok?: boolean; reason?: string } | undefined;
    const ok = res.ok && body?.ok !== false;
    if (opts.log !== false)
      audit({ who: email!, project: project.id, action, target: opts.target, detail: { ...opts.detail, ok, reason: body?.reason } });
    return ok
      ? { ok: true, message: "Listo", data: res.data as T }
      : { ok: false, message: res.error ?? body?.reason ?? "No se pudo" };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Error" };
  }
}
