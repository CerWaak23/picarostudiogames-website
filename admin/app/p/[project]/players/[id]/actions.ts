"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { backendFor } from "@/lib/backends";
import { audit } from "@/lib/audit";

export type ActionResult = { ok: boolean; message: string };

const ID = /^[A-Za-z0-9_-]{6,64}$/;
const note = (v: unknown) => String(v ?? "").replace(/[\u0000-\u001f]/g, "").slice(0, 60);

/**
 * Todas las acciones pasan por aquí: sesión válida, rol owner, id válido, llamada al backend y
 * registro en la auditoría (con el resultado). El servidor del juego vuelve a validar todo.
 */
async function run(
  projectId: string,
  action: string,
  target: string,
  params: Record<string, unknown>,
  detail: Record<string, unknown> = {},
): Promise<ActionResult> {
  let email: string | undefined;
  try {
    const session = await auth();
    email = session?.user?.email ?? undefined;
    const { project } = requireAccess(email, projectId, "owner");
    if (!ID.test(target)) return { ok: false, message: "Id de jugador inválido" };

    const res = await backendFor(project).call({ action, params: { target, ...params } });
    const data = res.data as { ok?: boolean; reason?: string } | undefined;
    const ok = res.ok && data?.ok !== false;
    audit({ who: email!, project: project.id, action, target, detail: { ...detail, ok, reason: data?.reason } });
    revalidatePath(`/p/${projectId}/players/${target}`);
    return ok ? { ok: true, message: "Listo" } : { ok: false, message: res.error ?? data?.reason ?? "No se pudo" };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Error" };
  }
}

export async function banPlayer(projectId: string, target: string, unban: boolean, why: string) {
  return run(projectId, "players.ban", target, { unban, note: note(why) }, { unban, why: note(why) });
}

export async function hidePlayer(projectId: string, target: string, show: boolean) {
  return run(projectId, show ? "players.show" : "players.hide", target, {}, { show });
}

export async function giftPlayer(projectId: string, target: string, crystals: number, gold: number, passDays: number, why: string) {
  const n = (v: number) => (Number.isFinite(v) ? Math.trunc(v) : 0);
  const gift = { crystals: n(crystals), gold: n(gold), passDays: n(passDays) };
  return run(projectId, "players.gift", target, { gift, note: note(why) }, { ...gift, why: note(why) });
}

export async function adminPlayer(projectId: string, target: string, on: boolean) {
  return run(projectId, "players.admin", target, { on }, { on });
}

/** Borra todo lo del jugador en el servidor. Exige escribir REINICIAR. */
export async function resetPlayer(projectId: string, target: string, typed: string, why: string) {
  if (typed.trim() !== "REINICIAR") return { ok: false, message: "Escribe REINICIAR para confirmar" };
  return run(projectId, "players.reset", target, { note: note(why) }, { why: note(why) });
}

/** Deshace un reinicio (el teléfono guarda una copia por 24 horas). */
export async function restorePlayer(projectId: string, target: string) {
  return run(projectId, "players.restore", target, { note: "Recuperación" });
}
