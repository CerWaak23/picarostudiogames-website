import { NextResponse } from "next/server";
import { fitnessEraUgs, runScript } from "@/lib/ugs";

/**
 * Lista de espera del playtesting de Fitness Era.
 *
 * El formulario de /games/fitness-era manda acá; acá se valida y se guarda en Unity Gaming
 * Services (script de Cloud Code `Playtesters`, acción `anotar`). El navegador nunca ve la llave
 * del service account.
 *
 * Variables de entorno (Vercel → proyecto de la web):
 *   UGS_FITNESSERA_PROJECT_ID, UGS_FITNESSERA_ENV_ID    los mismos del panel, no son secretos
 *   UGS_WEB_KEY, UGS_WEB_SECRET                         service account "picaro-web", para todos
 *                                                       los formularios del sitio
 *
 * La respuesta trae un `code` y no un texto: el que traduce es el formulario.
 */
export const runtime = "nodejs";

const MAX_EMAIL = 120;
const MAX_NAME = 40;
const MAX_BODY = 4000;
const PLATFORMS = ["android", "ios"];
// La misma de Playtesters.js. No intenta adivinar si el correo existe, solo que tenga forma.
const EMAIL = /^[^\s@,;]+@[^\s@,;.]+(\.[^\s@,;.]+)+$/;

// Freno simple al abuso: 5 envíos cada 10 minutos por IP. Vive en memoria, así que en serverless
// cada instancia lleva su propia cuenta; alcanza para el ruido normal y no mete otra dependencia.
// Si algún día llega spam de verdad, lo siguiente es el firewall de Vercel, no código acá.
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function tooMany(ip: string): boolean {
  const now = Date.now();
  // Barrido barato para que el mapa no crezca sin fin en una instancia de larga vida.
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

const bad = (code: string, status: number) => NextResponse.json({ ok: false, code }, { status });

export async function POST(req: Request) {
  if ((req.headers.get("content-length") ?? "").length > 0 && Number(req.headers.get("content-length")) > MAX_BODY)
    return bad("email", 400);

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

  if (tooMany(caller(req))) return bad("rate", 429);

  const cfg = fitnessEraUgs();
  if (!cfg) {
    console.error("playtesting: faltan las variables UGS_WEB_* o UGS_FITNESSERA_*");
    return bad("backend", 503);
  }

  const platform = String(body.platform ?? "");
  const res = await runScript<{ ok?: boolean; reason?: string; again?: boolean }>(cfg, "Playtesters", {
    action: "anotar",
    email,
    name: String(body.name ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, MAX_NAME),
    platform: PLATFORMS.includes(platform) ? platform : "",
    source: "web",
    lang: body.lang === "en" ? "en" : "es",
  });

  if (!res.ok) {
    console.error("playtesting: no se pudo anotar", res.error);
    return bad("backend", 502);
  }
  return NextResponse.json({ ok: true, again: res.data?.again === true });
}
