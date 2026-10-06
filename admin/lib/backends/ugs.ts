import type { Backend, BackendCall, BackendConfig, BackendResult } from "../types";

const AUTH = "https://services.api.unity.com/auth/v1/token-exchange";
const CODE = "https://cloud-code.services.api.unity.com/v1/projects";

type Cached = { token: string; exp: number };
const cache = new Map<string, Cached>();

/**
 * Adaptador de Unity Gaming Services: cambia la llave del service account por un token corto y
 * ejecuta scripts de Cloud Code. Las llaves solo se leen en el servidor.
 *
 * OJO: los endpoints salen de la documentación de Unity y aún no se probaron con una cuenta real.
 * Falta verificar qué trae `context` en el script cuando llama un service account.
 */
export function ugsBackend(cfg: BackendConfig): Backend {
  async function token(): Promise<string> {
    const key = process.env[`${cfg.credsEnv}_KEY`];
    const secret = process.env[`${cfg.credsEnv}_SECRET`];
    if (!key || !secret) throw new Error(`Faltan las llaves ${cfg.credsEnv}_KEY / _SECRET`);

    const hit = cache.get(cfg.credsEnv);
    if (hit && hit.exp > Date.now() + 30_000) return hit.token;

    const url = `${AUTH}?projectId=${cfg.projectId}&environmentId=${cfg.environmentId}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Token exchange falló (${res.status})`);
    const body = (await res.json()) as { accessToken?: string };
    if (!body.accessToken) throw new Error("Token exchange sin accessToken");
    // El token dura poco; se reusa 10 min como máximo.
    cache.set(cfg.credsEnv, { token: body.accessToken, exp: Date.now() + 10 * 60_000 });
    return body.accessToken;
  }

  return {
    async call({ action, params }: BackendCall): Promise<BackendResult> {
      const map = cfg.actions[action];
      if (!map) return { ok: false, error: `Acción no soportada por este juego: ${action}` };
      try {
        const res = await fetch(`${CODE}/${cfg.projectId}/scripts/${map.script}?environmentId=${cfg.environmentId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json" },
          // Los parámetros fijos del contrato (p. ej. action) van al final: nada de afuera los pisa.
          body: JSON.stringify({ params: { ...params, ...map.params } }),
          cache: "no-store",
        });
        const body = await res.json().catch(() => null);
        if (!res.ok) return { ok: false, error: `Cloud Code ${res.status}` };
        return { ok: true, data: body?.output ?? body };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "error" };
      }
    },
  };
}
