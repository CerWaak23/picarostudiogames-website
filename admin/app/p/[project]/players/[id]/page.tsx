import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { backendFor } from "@/lib/backends";
import { audit } from "@/lib/audit";
import PlayerActions from "./PlayerActions";

type Detail = { ok?: boolean; reason?: string; player?: Record<string, unknown> };

const nf = new Intl.NumberFormat("es-CL");
const date = (unix: number) => new Date(unix * 1000).toLocaleDateString("es-CL", { timeZone: "America/Santiago", day: "numeric", month: "short", year: "numeric" });

const LABELS: Record<string, string> = {
  level: "Nivel", xp: "XP", wins: "Victorias", losses: "Derrotas", streak: "Racha (días)", eras: "Eras completadas", weapons: "Armas", quests: "Retos hechos",
  gold: "Oro", crystals: "Cristales", passUntil: "Pase del Héroe", buys: "Compras", ads: "Anuncios vistos",
  reps: "Repeticiones totales", weekReps: "Repeticiones esta semana", sessions: "Sesiones", playMinutes: "Minutos jugados", activeDays: "Días activos", last: "Última vez", version: "Versión", lang: "Idioma",
  banned: "Baneado", hidden: "Oculto del ranking", isAdmin: "Administrador", pending: "Regalos pendientes", frame: "Marco", title: "Título",
};

const GROUPS: [string, string[]][] = [
  ["Progreso", ["level", "xp", "wins", "losses", "streak", "eras", "weapons", "quests"]],
  ["Economía", ["gold", "crystals", "passUntil", "buys", "ads"]],
  ["Actividad", ["reps", "weekReps", "sessions", "playMinutes", "activeDays", "last", "version", "lang"]],
  ["Cuenta", ["banned", "hidden", "isAdmin", "pending", "frame", "title"]],
];
const HIDDEN = new Set(["id", "name", "baseAdmin", "noProfile"]);

function show(key: string, v: unknown): string {
  if (typeof v === "boolean") return v ? "Sí" : "No";
  if ((key === "passUntil" || key === "last") && typeof v === "number") return v > Date.now() / 1000 || key === "last" ? (v > 0 ? date(v) : "Nunca") : "Sin pase";
  if (typeof v === "number") return nf.format(v);
  if (v === null || v === undefined || v === "") return "Sin dato";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export default async function PlayerPage(props: { params: Promise<{ project: string; id: string }> }) {
  const params = await props.params;
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

  const known = new Set(GROUPS.flatMap(([, keys]) => keys));
  const others = p ? Object.keys(p).filter((k) => !known.has(k) && !HIDDEN.has(k)) : [];

  return (
    <>
      <Link href={`/p/${project.id}/players`} className="crumb">← Jugadores</Link>
      {!p ? (
        <p className="notice err">No se pudo leer: {res.error ?? out?.reason ?? "error"}</p>
      ) : (
        <>
          <div className="page-head">
            <h1>
              {String(p.name || "Sin nombre")}
              {p.banned === true && <span className="badge danger" style={{ fontSize: "0.8rem" }}>baneado</span>}
              {p.hidden === true && <span className="badge" style={{ fontSize: "0.8rem" }}>oculto</span>}
              {p.isAdmin === true && <span className="badge gold" style={{ fontSize: "0.8rem" }}>admin</span>}
            </h1>
            <p><span className="mono">{params.id}</span></p>
          </div>

          <div className="grid-2" style={{ alignItems: "start" }}>
            {GROUPS.map(([title, keys]) => {
              const present = keys.filter((k) => k in p);
              if (present.length === 0) return null;
              return (
                <section key={title}>
                  <div className="section-title"><h2>{title}</h2></div>
                  <dl className="panel pad kv" style={{ margin: 0 }}>
                    {present.map((k) => (
                      <div key={k}><dt>{LABELS[k] ?? k}</dt><dd>{show(k, p[k])}</dd></div>
                    ))}
                  </dl>
                </section>
              );
            })}
          </div>

          {others.length > 0 && (
            <section className="section">
              <div className="section-title"><h2>Otros datos</h2></div>
              <dl className="panel pad kv" style={{ margin: 0 }}>
                {others.map((k) => (
                  <div key={k}><dt>{LABELS[k] ?? k}</dt><dd>{show(k, p[k])}</dd></div>
                ))}
              </dl>
            </section>
          )}

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
    </>
  );
}
