import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { backendFor } from "@/lib/backends";
import { audit } from "@/lib/audit";

type Summary = {
  players: number; activeToday: number; active7: number; new7: number;
  reps: number; hours: number; minPerDay: number; minPerSession: number;
  ads: number; buys: number; payers: number; passActive: number; banned: number; avgLevel: number;
  topReps?: Row[]; topLevel?: Row[];
};
type Row = { id: string; name: string; level: number; reps: number; streak: number; banned: boolean };

const nf = new Intl.NumberFormat("es-CL");

export default async function Kpis(props: { params: Promise<{ project: string }> }) {
  const params = await props.params;
  const session = await auth();
  let access;
  try {
    access = requireAccess(session?.user?.email, params.project);
  } catch {
    notFound();
  }
  const { project } = access;
  if (!project.modules.includes("kpis")) notFound();

  const res = await backendFor(project).call({ action: "players.summary", params: {} });
  audit({ who: session!.user!.email!, project: project.id, action: "players.summary" });
  const out = res.ok ? (res.data as (Summary & { ok?: boolean; reason?: string })) : null;

  const tiles: [string, string][] = out && out.ok !== false ? [
    ["Jugadores", nf.format(out.players)],
    ["Activos hoy", nf.format(out.activeToday)],
    ["Activos 7 días", nf.format(out.active7)],
    ["Nuevos 7 días", nf.format(out.new7)],
    ["Repeticiones", nf.format(out.reps)],
    ["Horas jugadas", nf.format(out.hours)],
    ["Min por día", nf.format(out.minPerDay)],
    ["Min por sesión", nf.format(out.minPerSession)],
    ["Nivel promedio", nf.format(out.avgLevel)],
    ["Anuncios vistos", nf.format(out.ads)],
    ["Compras", nf.format(out.buys)],
    ["Pagadores", nf.format(out.payers)],
    ["Pase activo", nf.format(out.passActive)],
    ["Baneados", nf.format(out.banned)],
  ] : [];

  return (
    <main>
      <p><a href={`/p/${project.id}`}>← {project.name}</a></p>
      <h1>KPIs</h1>
      {!out || out.ok === false ? (
        <p className="err">No se pudo leer: {res.error ?? out?.reason ?? "error"}</p>
      ) : (
        <>
          <div className="grid">
            {tiles.map(([k, v]) => (
              <div key={k} className="card">
                <div className="muted">{k}</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{v}</div>
              </div>
            ))}
          </div>
          <Top title="Más repeticiones" rows={out.topReps} />
          <Top title="Mayor nivel" rows={out.topLevel} />
        </>
      )}
    </main>
  );
}

function Top({ title, rows }: { title: string; rows?: Row[] }) {
  if (!rows?.length) return null;
  return (
    <section style={{ marginTop: 28 }}>
      <h2 style={{ fontSize: "1.1rem" }}>{title}</h2>
      <div className="card">
        {rows.slice(0, 10).map((r, i) => (
          <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
            <span>{i + 1}. {r.name || "Sin nombre"} {r.banned && <span className="tag">baneado</span>}</span>
            <span className="muted">nivel {r.level} · {nf.format(r.reps)} reps · racha {r.streak}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
