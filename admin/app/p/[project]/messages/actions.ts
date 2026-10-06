"use server";

import { revalidatePath } from "next/cache";
import { runAdmin, type Outcome } from "@/lib/run";

const KINDS = ["none", "text", "one", "many", "stars"];
const ID = /^[A-Za-z0-9_-]{6,64}$/;
const MSG_ID = /^m[0-9]{6,20}$/;
const clean = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);

/** to vacío = a todos los jugadores. */
export async function sendMessage(
  projectId: string,
  to: string,
  title: string,
  body: string,
  kind: string,
  options: string[],
): Promise<Outcome> {
  if (to && !ID.test(to)) return { ok: false, message: "Jugador inválido" };
  if (!KINDS.includes(kind)) return { ok: false, message: "Tipo de respuesta inválido" };
  const opts = options.map((o) => clean(o, 40)).filter(Boolean).slice(0, 6);
  if ((kind === "one" || kind === "many") && opts.length < 2) return { ok: false, message: "Pon al menos 2 opciones" };
  const msg = { to, title: clean(title, 60), body: clean(body, 500), kind, options: opts };
  if (!msg.title || !msg.body) return { ok: false, message: "Falta el título o el texto" };

  const r = await runAdmin(projectId, "messages.send", { msg }, { need: "owner", target: to || "todos", detail: { title: msg.title, kind } });
  revalidatePath(`/p/${projectId}/messages`);
  return r;
}

export async function deleteMessage(projectId: string, id: string): Promise<Outcome> {
  if (!MSG_ID.test(id)) return { ok: false, message: "Mensaje inválido" };
  const r = await runAdmin(projectId, "messages.delete", { id }, { need: "owner", target: id });
  revalidatePath(`/p/${projectId}/messages`);
  return r;
}
