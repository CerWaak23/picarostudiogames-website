import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { runAdmin } from "@/lib/run";

type Row = { id: string; name: string; level: number; reps: number; streak: number; banned: boolean };
type Summary = {
  players: number; activeToday: number; active7: number; new7: number;
  reps: number; hours: number; minPerDay: number; minPerSession: number;
  ads: number; buys: number; payers: number; passActive: number; banned: number; avgLevel: number;
  topReps?: Row[]; topLevel?: Row[]; topStreak?: Row[];
};

const nf = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 1 });

function Group({ title, items }: { title: string; items: [string, number][] }) {
  return (
    <div>
      <div className="section-title"><h2>{title}</h2></div>
      <dl className="panel pad kv" style={{ margin: 0 }}>
        {items.map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd>{nf.format(v)}</dd></div>
        ))}
      </dl>
    </div>
  );
}

function Top({ title, rows, unit, pick, base }: { title: string; rows?: Row[]; unit: string; pick: (r: Row) => number; base: string }) {
  if (!rows?.length) return null;
  return (
    <div>
      <div className="section-title"><h2>{title}</h2></div>
      <div className="panel rows">
        {rows.slice(0, 5).map((r, i) => (
          <Link key={r.id} href={`${base}/${r.id}`} className="row">
            <div className="main"><div className="title">{i + 1}. {r.name || "Sin nombre"}{r.banned && <span className="badge danger">baneado</span>}</div></div>
            <div className="aside">{nf.format(pick(r))} {unit}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

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

  const res = await runAdmin<Summary>(project.id, "players.summary", {}, { target: "resumen" });
  const s = res.ok ? res.data : undefined;
  const base = `/p/${project.id}/players`;

  return (
    <>
      <div className="page-head">
        <h1>Métricas</h1>
        <p>Cifras del juego completo. Se calculan al abrir esta página.</p>
      </div>
      {!s ? (
        <p className="notice err">No se pudo leer: {res.message}</p>
      ) : (
        <div className="stack" style={{ gap: 28 }}>
          <div className="grid-2" style={{ alignItems: "start" }}>
            <Group title="Actividad" items={[["Jugadores", s.players], ["Activos hoy", s.activeToday], ["Activos en 7 días", s.active7], ["Nuevos en 7 días", s.new7]]} />
            <Group title="Tiempo de uso" items={[["Horas jugadas", s.hours], ["Minutos por día", s.minPerDay], ["Minutos por sesión", s.minPerSession]]} />
          </div>
          <div className="grid-2" style={{ alignItems: "start" }}>
            <Group title="Ingresos" items={[["Anuncios vistos", s.ads], ["Compras", s.buys], ["Pagadores", s.payers], ["Pase activo", s.passActive]]} />
            <Group title="Juego" items={[["Repeticiones", s.reps], ["Nivel promedio", s.avgLevel], ["Baneados", s.banned]]} />
          </div>
          <div className="grid-2" style={{ alignItems: "start" }}>
            <Top title="Más repeticiones" rows={s.topReps} unit="reps" pick={(r) => r.reps} base={base} />
            <Top title="Mayor nivel" rows={s.topLevel} unit="nivel" pick={(r) => r.level} base={base} />
          </div>
          <div className="grid-2" style={{ alignItems: "start" }}>
            <Top title="Mejor racha" rows={s.topStreak} unit="días" pick={(r) => r.streak} base={base} />
          </div>
        </div>
      )}
    </>
  );
}
