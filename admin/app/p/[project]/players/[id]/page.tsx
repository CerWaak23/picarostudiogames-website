import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { backendFor } from "@/lib/backends";
import { audit } from "@/lib/audit";
import PlayerActions from "./PlayerActions";

type Detail = { ok?: boolean; reason?: string; player?: Record<string, unknown> };

const LABELS: Record<string, string> = {
  name: "Nombre", level: "Nivel", weekReps: "Reps esta semana", pending: "Regalos pendientes",
  banned: "Baneado", hidden: "Oculto del ranking", isAdmin: "Administrador", noProfile: "Sin perfil guardado",
};

function show(v: unknown): string {
  if (typeof v === "boolean") return v ? "sí" : "no";
  if (typeof v === "number") return new Intl.NumberFormat("es-CL").format(v);
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export default async function PlayerPage({ params }: { params: { project: string; id: string } }) {
  const session = await auth();
  let access;
  try {
    access = requireAccess(session?.user?.email, params.project);
  } catch {
    notFound();
  }
  const { project, role } = access;
  if (!project.modules.includes("players")) notFound();
  // El id llega de la URL: se valida igual que el servidor antes de reenviarlo.
  if (!/^[A-Za-z0-9_-]{6,64}$/.test(params.id)) notFound();

  const res = await backendFor(project).call({ action: "players.view", params: { target: params.id } });
  audit({ who: session!.user!.email!, project: project.id, action: "players.view", target: params.id });
  const out = res.ok ? (res.data as Detail) : null;
  const p = out?.player;

  return (
    <main>
      <p><a href={`/p/${project.id}/players`}>← Jugadores</a></p>
      {!p ? (
        <p className="err">No se pudo leer: {res.error ?? out?.reason ?? "error"}</p>
      ) : (
        <>
          <h1>{String(p.name || "Sin nombre")}</h1>
          <p className="muted">{params.id}</p>
          <div className="card">
            {Object.entries(p)
              .filter(([k]) => k !== "id" && k !== "name")
              .sort(([a], [b]) => (a in LABELS ? 0 : 1) - (b in LABELS ? 0 : 1))
              .map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "5px 0", borderBottom: "1px solid var(--surface-2)" }}>
                  <span className="muted">{LABELS[k] ?? k}</span>
                  <span style={{ textAlign: "right", wordBreak: "break-word", maxWidth: "65%" }}>{show(v)}</span>
                </div>
              ))}
          </div>
          {role === "owner" && (
            <PlayerActions
              projectId={project.id}
              target={params.id}
              banned={p.banned === true}
              hidden={p.hidden === true}
              isAdmin={p.isAdmin === true}
              baseAdmin={p.baseAdmin === true}
            />
          )}
        </>
      )}
    </main>
  );
}
