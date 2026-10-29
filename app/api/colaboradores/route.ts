import { NextResponse } from "next/server";
import { fitnessEraUgs, runScript } from "@/lib/ugs";

/**
 * «Trabajemos juntos»: quien quiere meterse en un proyecto con el estudio.
 *
 * El formulario de la home manda acá; acá se valida y se guarda en Unity Gaming Services
 * (script de Cloud Code `Colaboradores`, acción `anotar`). Usa el mismo service account que la
 * lista de espera del playtesting, así que no hay variables de entorno nuevas.
 *
 * La respuesta trae un `code` y no un texto: el que traduce es el formulario.
 */
export const runtime = "nodejs";

const MAX_EMAIL = 120;
const MAX_NAME = 60;
const MAX_LINK = 300;
const MAX_NOTE = 600;
const MAX_BODY = 8000;
const AREAS = ["arte", "musica", "codigo", "narrativa", "produccion", "otro"];
const EMAIL = /^[^\s@,;]+@[^\s@,;.]+(\.[^\s@,;.]+)+$/;

// El mismo freno que la lista de espera, con su propia cuenta: 5 envíos cada 10 minutos por IP.
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function tooMany(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

/** La IP no se guarda en ningún lado: solo vive acá, revuelta, mientras dura la instancia. */
function caller(req: Request): string {
  const raw = (req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "").split(",")[0].trim();
  let h = 0x811c9dc5;
  for (let i = 0; i < raw.length; i++) {
    h ^= raw.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16);
}

const clean = (v: unknown, max: number) =>
  String(v ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, " ").trim().slice(0, max);

const bad = (code: string, status: number) => NextResponse.json({ ok: false, code }, { status });

export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) return bad("email", 400);

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return bad("email", 400);
  }

  // Campo trampa: los navegadores no lo ven, los robots lo llenan. Se responde que sí y se tira.
  if (String(body.website ?? "").trim() !== "") return NextResponse.json({ ok: true, again: false });

  const email = String(body.email ?? "").trim().toLowerCase().slice(0, MAX_EMAIL);
  if (!EMAIL.test(email)) return bad("email", 400);

  const name = clean(body.name, MAX_NAME);
  if (!name) return bad("name", 400);

  // Un enlace que no sea http(s) no se guarda, pero tampoco corta el envío: el resto sirve igual.
  const raw = clean(body.link, MAX_LINK);
  const link = /^https?:\/\/[^\s]+$/i.test(raw) ? raw : "";

  if (tooMany(caller(req))) return bad("rate", 429);

  const cfg = fitnessEraUgs();
  if (!cfg) {
    console.error("colaboradores: faltan las variables UGS_FITNESSERA_*");
    return bad("backend", 503);
  }

  const area = String(body.area ?? "");
  const res = await runScript<{ ok?: boolean; reason?: string; again?: boolean }>(cfg, "Colaboradores", {
    action: "anotar",
    email,
    name,
    area: AREAS.includes(area) ? area : "otro",
    link,
    note: clean(body.note, MAX_NOTE),
    lang: body.lang === "en" ? "en" : "es",
  });

  if (!res.ok) {
    console.error("colaboradores: no se pudo guardar", res.error);
    return bad("backend", 502);
  }
  return NextResponse.json({ ok: true, again: res.data?.again === true });
}
