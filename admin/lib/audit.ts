/**
 * Registro de auditoría: quién hizo qué, en qué juego y cuándo. Por ahora va a los logs de Vercel
 * (JSON, una línea por evento). Cuando haya acciones de escritura se guarda además en una base
 * propia para poder verlo en el módulo "audit".
 */
export interface AuditEvent {
  who: string;
  project: string;
  action: string;
  target?: string;
  detail?: Record<string, unknown>;
}

export function audit(e: AuditEvent) {
  console.log(JSON.stringify({ kind: "audit", at: new Date().toISOString(), ...e }));
}
