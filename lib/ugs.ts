/**
 * Unity Gaming Services desde el servidor de la web pública.
 *
 * Es el mismo camino que usa el panel (admin/lib/backends/ugs.ts): se cambia la llave de un
 * service account por un token corto y con ese token se ejecuta un script de Cloud Code. La
 * diferencia es la llave: la web usa `fitnessera-web`, un service account aparte que solo sabe
 * ejecutar Cloud Code. Si alguna vez se filtra, no puede administrar nada: los scripts de
 * administración piden estar en su lista de admins y este no está.
 *
 * Las llaves se leen solo acá y solo en el servidor. Nunca llegan al navegador.
 */

const AUTH = "https://services.api.unity.com/auth/v1/token-exchange";
const CODE = "https://cloud-code.services.api.unity.com/v1/projects";

export interface UgsConfig {
  projectId: string;
  environmentId: string;
  key: string;
  secret: string;
}

/** Devuelve la configuración, o null si falta alguna variable de entorno. */
export function fitnessEraUgs(): UgsConfig | null {
  const cfg = {
    projectId: process.env.UGS_FITNESSERA_PROJECT_ID ?? "",
    environmentId: process.env.UGS_FITNESSERA_ENV_ID ?? "",
    key: process.env.UGS_FITNESSERA_WEB_KEY ?? "",
    secret: process.env.UGS_FITNESSERA_WEB_SECRET ?? "",
  };
  return cfg.projectId && cfg.environmentId && cfg.key && cfg.secret ? cfg : null;
}

type Cached = { token: string; exp: number };
let cache: Cached | null = null;

async function token(cfg: UgsConfig): Promise<string> {
  if (cache && cache.exp > Date.now() + 30_000) return cache.token;

  const auth = Buffer.from(`${cfg.key}:${cfg.secret}`).toString("base64");
  const res = await fetch(`${AUTH}?projectId=${cfg.projectId}&environmentId=${cfg.environmentId}`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`token-exchange ${res.status}`);
  const body = (await res.json()) as { accessToken?: string };
  if (!body.accessToken) throw new Error("token-exchange sin accessToken");
  // El token dura poco; se reusa 10 minutos como máximo.
  cache = { token: body.accessToken, exp: Date.now() + 10 * 60_000 };
  return body.accessToken;
}

export interface ScriptResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

/** Ejecuta un script de Cloud Code. `ok` es false si falló la llamada o si el script dijo que no. */
export async function runScript<T extends { ok?: boolean; reason?: string }>(
  cfg: UgsConfig,
  script: string,
  params: Record<string, unknown>,
): Promise<ScriptResult<T>> {
  try {
    const res = await fetch(`${CODE}/${cfg.projectId}/scripts/${script}?environmentId=${cfg.environmentId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${await token(cfg)}`, "Content-Type": "application/json" },
      body: JSON.stringify({ params }),
      cache: "no-store",
    });
    if (!res.ok) {
      // Un token vencido antes de tiempo no debería dejar el error pegado en la caché.
      if (res.status === 401) cache = null;
      return { ok: false, error: `Cloud Code ${res.status}` };
    }
    const body = (await res.json().catch(() => null)) as { output?: T } | null;
    const out = (body?.output ?? body) as T | undefined;
    if (out?.ok === false) return { ok: false, data: out, error: out.reason };
    return { ok: true, data: out };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "error" };
  }
}
