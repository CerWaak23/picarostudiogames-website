"use server";

import { revalidatePath } from "next/cache";
import { runAdmin, type Outcome } from "@/lib/run";

const FB_ID = /^[0-9]{6,12}-[0-9]{1,7}$/;
const REPORT_ID = /^r[0-9]{6,20}$/;
const PLAYER_ID = /^[A-Za-z0-9_-]{6,64}$/;

export async function markFeedback(projectId: string, id: string, done: boolean): Promise<Outcome> {
  if (!FB_ID.test(id)) return { ok: false, message: "Feedback inválido" };
  const r = await runAdmin(projectId, "feedback.done", { id, done }, { need: "owner", target: id, detail: { done } });
  revalidatePath(`/p/${projectId}/feedback`);
  return r;
}

export async function markReport(projectId: string, id: string, done: boolean): Promise<Outcome> {
  if (!REPORT_ID.test(id)) return { ok: false, message: "Reporte inválido" };
  const r = await runAdmin(projectId, "reports.done", { id, done }, { need: "owner", target: id, detail: { done } });
  revalidatePath(`/p/${projectId}/feedback`);
  return r;
}

/** El jugador pidió empezar de cero: se reinicia su cuenta y la solicitud queda revisada. */
export async function acceptRestart(projectId: string, feedbackId: string, playerId: string): Promise<Outcome> {
  if (!FB_ID.test(feedbackId) || !PLAYER_ID.test(playerId)) return { ok: false, message: "Datos inválidos" };
  const reset = await runAdmin(projectId, "players.reset", { target: playerId, note: "Pediste empezar de cero" },
    { need: "owner", target: playerId, detail: { via: "solicitud", feedbackId } });
  if (!reset.ok) return reset;
  const r = await runAdmin(projectId, "feedback.done", { id: feedbackId, done: true }, { need: "owner", target: feedbackId });
  revalidatePath(`/p/${projectId}/feedback`);
  return r;
}
