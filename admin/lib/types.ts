/** Quién puede qué dentro de un juego. viewer = solo lectura (KPIs); owner = todo. */
export type Role = "owner" | "viewer";

/** Módulos que un juego puede activar. Cada uno es una pantalla + acciones. */
export type ModuleId = "kpis" | "players" | "ban" | "codes" | "messages" | "feedback" | "admins" | "audit";

/** Un backend sabe ejecutar una acción de admin de un juego. Cada tipo (ugs, http…) lo implementa. */
export interface Backend {
  call(action: BackendCall): Promise<BackendResult>;
}

export interface BackendCall {
  /** Nombre del contrato, no del script: "players.search", "ban.set", "codes.create"… */
  action: string;
  params: Record<string, unknown>;
}

export interface BackendResult {
  ok: boolean;
  data?: unknown;
  error?: string;
}

export type BackendConfig = {
  type: "ugs";
  projectId: string;
  environmentId: string;
  /** Prefijo de las variables de entorno con las llaves, p. ej. "UGS_FITNESSERA" → _KEY y _SECRET. */
  credsEnv: string;
  /** Contrato → nombre del script de Cloud Code y la acción que se le pasa. */
  actions: Record<string, { script: string; params?: Record<string, unknown> }>;
};

export interface ProjectConfig {
  id: string;
  name: string;
  backend: BackendConfig;
  modules: ModuleId[];
  /** correo → rol. Solo estos correos entran a este juego. */
  roles: Record<string, Role>;
}
