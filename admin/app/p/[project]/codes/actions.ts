"use server";

import { revalidatePath } from "next/cache";
import { runAdmin, type Outcome } from "@/lib/run";

const CODE = /^[A-Za-z0-9]*$/;
const int = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Number.isFinite(v) ? Math.trunc(v) : 0));

/** code vacío = el servidor genera uno al azar. maxUses 0 = sin límite; days 0 = no vence. */
export async function createCode(
  projectId: string,
  code: string,
  crystals: number,
  gold: number,
  passDays: number,
  maxUses: number,
  days: number,
  note: string,
): Promise<Outcome<{ codes?: { code: string }[] }>> {
  const c = code.trim().toUpperCase();
  if (!CODE.test(c) || (c && (c.length < 4 || c.length > 16))) return { ok: false, message: "El código va de 4 a 16 letras y números" };
  const params = {
    code: c,
    crystals: int(crystals, 0, 20000),
    gold: int(gold, 0, 100000),
    passDays: int(passDays, 0, 365),
    maxUses: int(maxUses, 0, 1000000),
    days: int(days, 0, 3650),
    note: note.replace(/[\u0000-\u001f]/g, "").slice(0, 40),
  };
  if (params.crystals + params.gold + params.passDays <= 0) return { ok: false, message: "El código no da nada" };
  const r = await runAdmin<{ codes?: { code: string }[] }>(projectId, "codes.create", params, { need: "owner", target: c || "(al azar)", detail: params });
  revalidatePath(`/p/${projectId}/codes`);
  return r;
}

export async function pauseCode(projectId: string, code: string, paused: boolean): Promise<Outcome> {
  if (!/^[A-Z0-9]{4,16}$/.test(code)) return { ok: false, message: "Código inválido" };
  const r = await runAdmin(projectId, "codes.pause", { code, paused }, { need: "owner", target: code, detail: { paused } });
  revalidatePath(`/p/${projectId}/codes`);
  return r;
}
