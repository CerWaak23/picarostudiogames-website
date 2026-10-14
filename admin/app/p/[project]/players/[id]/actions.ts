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

/**
 * Borra la cuenta del todo (para limpiar cuentas que ya nadie usa). Exige escribir BORRAR.
 * Primero el juego borra sus datos; después se borra su cuenta de inicio de sesión en Unity.
 * No se puede deshacer.
 */
export async function deletePlayer(projectId: string, target: string, typed: string): Promise<ActionResult> {
  if (typed.trim() !== "BORRAR") return { ok: false, message: "Escribe BORRAR para confirmar" };
  let email: string | undefined;
  try {
    const session = await auth();
    email = session?.user?.email ?? undefined;
    const { project } = requireAccess(email, projectId, "owner");
    if (!ID.test(target)) return { ok: false, message: "Id de jugador inválido" };

    const backend = backendFor(project);
    const res = await backend.call({ action: "players.delete", params: { target } });
    const data = res.data as { ok?: boolean; reason?: string } | undefined;
    const dataOk = res.ok && data?.ok !== false;
    const acct = dataOk && backend.deletePlayerAccount ? await backend.deletePlayerAccount(target) : null;
    const ok = dataOk && (acct?.ok ?? false);
    audit({ who: email!, project: project.id, action: "players.delete", target,
            detail: { ok, data: dataOk, account: acct?.ok ?? false, reason: data?.reason ?? acct?.error } });
    revalidatePath(`/p/${projectId}/players`);
    if (!dataOk) return { ok: false, message: res.error ?? data?.reason ?? "No se pudo borrar" };
    if (!acct?.ok) return { ok: false, message: `Se borraron sus datos, pero no la cuenta: ${acct?.error ?? "sin soporte"}` };
    return { ok: true, message: "Cuenta borrada" };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Error" };
  }
}

/** Deshace un reinicio (el teléfono guarda una copia por 24 horas). */
export async function restorePlayer(projectId: string, target: string) {
  return run(projectId, "players.restore", target, { note: "Recuperación" });
}
