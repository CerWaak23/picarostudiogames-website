"use server";

import { revalidatePath } from "next/cache";
import { runAdmin, type Outcome } from "@/lib/run";

const PLAYER_ID = /^[A-Za-z0-9_-]{6,64}$/;

/** Hacer o quitar a alguien como administrador. Los fijos (en el código de los scripts) no se pueden quitar. */
export async function setAdmin(projectId: string, target: string, on: boolean): Promise<Outcome> {
  if (!PLAYER_ID.test(target)) return { ok: false, message: "Jugador inválido" };
  const r = await runAdmin(projectId, "players.admin", { target, on }, { need: "owner", target, detail: { on } });
  revalidatePath(`/p/${projectId}/admins`);
  return r;
}
