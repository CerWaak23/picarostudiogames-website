import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { runAdmin } from "@/lib/run";
import ItemActions from "./ItemActions";

type Fb = { id: string; p: string; n: string; cat: string; text: string; at: number; done: boolean; v: string };
type Rep = { id: string; p: string; n: string; kind: string; cat: string; text: string; info: string; at: number; done: boolean; v: string; size: number };

const when = (unix: number) => new Date(unix * 1000).toLocaleString("es-CL", { timeZone: "America/Santiago", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const CAT: Record<string, string> = { error: "Error", idea: "Idea", otro: "Otro", reinicio: "Empezar de cero" };

export default async function Feedback(props: { params: Promise<{ project: string }> }) {
  const params = await props.params;
  const session = await auth();
  let access;
  try {
    access = requireAccess(session?.user?.email, params.project);
  } catch {
    notFound();
  }
  const { project, role } = access;
  if (!project.modules.includes("feedback")) notFound();

  const [fb, rp] = await Promise.all([
    runAdmin<{ feedback?: Fb[]; pending?: number }>(project.id, "feedback.list", {}, { log: false }),
    runAdmin<{ reports?: Rep[]; pending?: number }>(project.id, "reports.list", {}, { log: false }),
  ]);
  const owner = role === "owner";
  const items = fb.data?.feedback ?? [];
  const reports = rp.data?.reports ?? [];
  const restarts = items.filter((f) => f.cat === "reinicio" && !f.done).length;

  return (
    <>
      <div className="page-head">
        <h1>Feedback y reportes</h1>
        <p>Lo que cuentan los jugadores. Marca como revisado lo que ya atendiste.</p>
      </div>

      {restarts > 0 && (
        <p className="notice gold" style={{ marginBottom: 18 }}>
          {restarts} jugador{restarts === 1 ? "" : "es"} pide{restarts === 1 ? "" : "n"} empezar de cero. Acéptalo con el botón rojo de cada solicitud.
        </p>
      )}

      <section>
        <div className="section-title"><h2>Feedback</h2><span>{fb.data?.pending ?? 0} sin revisar</span></div>
        {!fb.ok && <p className="notice err">No se pudo leer: {fb.message}</p>}
        {fb.ok && items.length === 0 ? (
          <div className="panel empty"><strong>Sin feedback todavía.</strong>Nadie se ha quejado. Ni aplaudido.</div>
        ) : (
          <div className="panel rows">
            {items.map((f) => (
              <div key={f.id} className="row" style={{ alignItems: "flex-start", flexDirection: "column", gap: 6, opacity: f.done ? 0.55 : 1 }}>
                <div className="cluster" style={{ gap: 0 }}>
                  <span className={`badge ${f.cat === "reinicio" ? "gold" : ""}`} style={{ marginLeft: 0, marginRight: 8 }}>{CAT[f.cat] ?? f.cat}</span>
                  <strong>{f.n || "Sin nombre"}</strong>
                  <span className="faint" style={{ marginLeft: 8, fontSize: "0.82rem" }}>{when(f.at)}{f.v ? ` · v${f.v}` : ""}</span>
                </div>
                <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{f.text}</div>
                {owner && <ItemActions projectId={project.id} id={f.id} done={f.done} kind="feedback" restartFor={f.cat === "reinicio" ? f.p : undefined} />}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-title"><h2>Reportes de pelea</h2><span>{rp.data?.pending ?? 0} sin revisar</span></div>
        {!rp.ok && <p className="notice err">No se pudo leer: {rp.message}</p>}
        {rp.ok && reports.length === 0 ? (
          <div className="panel empty"><strong>Sin reportes.</strong>El detector de flexiones se está portando bien.</div>
        ) : (
          <div className="panel rows">
            {reports.map((r) => (
              <div key={r.id} className="row" style={{ alignItems: "flex-start", flexDirection: "column", gap: 6, opacity: r.done ? 0.55 : 1 }}>
                <div className="cluster" style={{ gap: 0 }}>
                  <span className="badge" style={{ marginLeft: 0, marginRight: 6 }}>{r.kind === "grabacion" ? "Grabación" : "Pelea"}</span>
                  <span className="badge" style={{ marginLeft: 0, marginRight: 8 }}>{r.cat}</span>
                  <strong>{r.n || "Sin nombre"}</strong>
                  <span className="faint" style={{ marginLeft: 8, fontSize: "0.82rem" }}>{when(r.at)}{r.v ? ` · v${r.v}` : ""}</span>
                </div>
                {r.text && <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{r.text}</div>}
                {r.info && <div className="faint" style={{ fontSize: "0.82rem", overflowWrap: "anywhere" }}>{r.info}</div>}
                {owner && <ItemActions projectId={project.id} id={r.id} done={r.done} kind="report" downloadHref={`/p/${project.id}/feedback/report/${r.id}`} />}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
