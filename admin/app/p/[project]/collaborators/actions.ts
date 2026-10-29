"use server";

import { revalidatePath } from "next/cache";
import { runAdmin, type Outcome } from "@/lib/run";

/** Marca una postulación como revisada (o la devuelve a pendiente). */
export async function markDone(projectId: string, key: string, done: boolean): Promise<Outcome> {
  if (!/^c[0-9a-f]{16}$/.test(key)) return { ok: false, message: "Postulación inválida" };
  const r = await runAdmin(projectId, "collaborators.done", { key, done }, { need: "owner", target: key, detail: { done } });
  revalidatePath(`/p/${projectId}/collaborators`);
  return r;
}
