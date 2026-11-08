"use server";

import { revalidatePath } from "next/cache";
import { runAdmin, type Outcome } from "@/lib/run";

/** Un comentario se identifica con "jugador:segundo" (el que lo mandó y cuándo llegó). */
const COMMENT_ID = /^[A-Za-z0-9_-]{6,64}:\d{9,11}$/;

export async function markComment(projectId: string, id: string, done: boolean): Promise<Outcome> {
  if (!COMMENT_ID.test(id)) return { ok: false, message: "Comentario inválido" };
  const r = await runAdmin(projectId, "comments.done", { q: id, target: done ? "si" : "no" }, { need: "owner", target: id, detail: { done } });
  revalidatePath(`/p/${projectId}/comments`);
  return r;
}
