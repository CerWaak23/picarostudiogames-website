"use server";

import { revalidatePath } from "next/cache";
import { runAdmin, type Outcome } from "@/lib/run";

const PLAYER_ID = /^[A-Za-z0-9_-]{6,64}$/;

/** Aprobar la deja visible en el ranking. Rechazar borra la imagen y el jugador puede subir otra. */
export async function reviewPhoto(projectId: string, target: string, decision: "approve" | "reject"): Promise<Outcome> {
  if (!PLAYER_ID.test(target)) return { ok: false, message: "Jugador inválido" };
  if (decision !== "approve" && decision !== "reject") return { ok: false, message: "Decisión inválida" };
  const r = await runAdmin(projectId, decision === "approve" ? "photos.approve" : "photos.reject", { target }, { need: "owner", target, detail: { decision } });
  revalidatePath(`/p/${projectId}/photos`);
  return r;
}
