import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { runAdmin } from "@/lib/run";
import Icon from "@/components/Icon";

type Row = { id: string; name: string; level: number; reps: number; streak: number; banned: boolean };
type Summary = { players: number; activeToday: number; active7: number; new7: number; reps: number; banned: number; topReps?: Row[] };
type Fb = { cat: string; done: boolean };

const nf = new Intl.NumberFormat("es-CL");

export default async function ProjectHome(props: { params: Promise<{ project: string }> }) {
  const params = await props.params;
  const session = await auth();
  let access;
  try {
    access = requireAccess(session?.user?.email, params.project);
  } catch {
    notFound();
  }
  const { project, role } = access;
  const has = (m: string) => project.modules.includes(m as never);

  const [sum, fb, rp] = await Promise.all([
    has("kpis") ? runAdmin<Summary>(project.id, "players.summary", {}, { log: false }) : null,
    has("feedback") ? runAdmin<{ feedback?: Fb[] }>(project.id, "feedback.list", {}, { log: false }) : null,
    has("feedback") ? runAdmin<{ pending?: number }>(project.id, "reports.list", {}, { log: false }) : null,
  ]);

  const s = sum?.ok ? sum.data : undefined;
  const items = fb?.data?.feedback ?? [];
  const restarts = items.filter((f) => f.cat === "reinicio" && !f.done).length;
  const feedbackPending = items.filter((f) => f.cat !== "reinicio" && !f.done).length;
  const reportsPending = rp?.data?.pending ?? 0;

  const attention = [
    { label: "Solicitudes de empezar de cero", n: restarts, href: `/p/${project.id}/feedback`, show: has("feedback") },
    { label: "Feedback sin revisar", n: feedbackPending, href: `/p/${project.id}/feedback`, show: has("feedback") },
    { label: "Reportes de pelea sin revisar", n: reportsPending, href: `/p/${project.id}/feedback`, show: has("feedback") },
  ].filter((a) => a.show);
  const open = attention.reduce((t, a) => t + a.n, 0);

  return (
    <>
      <div className="page-head">
        <h1>{project.name}</h1>
        <p>{role === "owner" ? "Esto es lo que pide tu atención hoy y cómo va el juego." : "Vista de solo lectura."}</p>
      </div>

      {attention.length > 0 && (
        <section>
          <div className="section-title">
            <h2>Requiere atención</h2>
            <span>{open === 0 ? "Todo al día" : `${open} pendiente${open === 1 ? "" : "s"}`}</span>
          </div>
          <div className="panel rows">
            {attention.map((a) => (
              <Link key={a.label} href={a.href} className="row">
                <div className="main"><div className="title" style={a.n === 0 ? { color: "var(--muted)", fontWeight: 500 } : undefined}>{a.label}</div></div>
                {a.n > 0 ? <span className="badge gold">{a.n}</span> : <span className="faint" style={{ fontSize: "0.82rem" }}>Al día</span>}
                <Icon name="chevron" className="chev" />
              </Link>
            ))}
          </div>
          {open === 0 && <p className="faint" style={{ marginTop: 10, fontSize: "0.86rem" }}>Nada pendiente. Hasta los pillos se portan hoy.</p>}
        </section>
      )}

      {has("kpis") && (
        <section className="section">
          <div className="section-title">
            <h2>El juego</h2>
            <Link href={`/p/${project.id}/kpis`} className="faint" style={{ fontSize: "0.82rem" }}>Ver métricas</Link>
          </div>
          {!s ? (
            <p className="notice err">No se pudo leer el resumen: {sum?.message ?? "error"}</p>
          ) : (
            <>
              <dl className="stats" style={{ margin: 0 }}>
                <div className="stat"><dt>Jugadores</dt><dd>{nf.format(s.players)}</dd></div>
                <div className="stat"><dt>Activos hoy</dt><dd>{nf.format(s.activeToday)}</dd></div>
                <div className="stat"><dt>Activos en 7 días</dt><dd>{nf.format(s.active7)}</dd></div>
                <div className="stat"><dt>Nuevos en 7 días</dt><dd>{nf.format(s.new7)}</dd></div>
              </dl>
              {(s.topReps?.length ?? 0) > 0 && (
                <div className="panel rows" style={{ marginTop: 14 }}>
                  {s.topReps!.slice(0, 5).map((p, i) => (
                    <Link key={p.id} href={`/p/${project.id}/players/${p.id}`} className="row">
                      <div className="main">
                        <div className="title">{i + 1}. {p.name || "Sin nombre"}{p.banned && <span className="badge danger">baneado</span>}</div>
                      </div>
                      <div className="aside">{nf.format(p.reps)} reps</div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      )}
    </>
  );
}
