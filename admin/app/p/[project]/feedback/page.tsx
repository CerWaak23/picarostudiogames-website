import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { runAdmin } from "@/lib/run";
import ItemActions from "./ItemActions";

type Fb = { id: string; p: string; n: string; cat: string; text: string; at: number; done: boolean; v: string };
type Rep = { id: string; p: string; n: string; kind: string; cat: string; text: string; info: string; at: number; done: boolean; v: string; size: number };

const when = (unix: number) => new Date(unix * 1000).toLocaleString("es-CL", { timeZone: "America/Santiago", dateStyle: "short", timeStyle: "short" });

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
  const restarts = (fb.data?.feedback ?? []).filter((f) => f.cat === "reinicio" && !f.done).length;

  return (
    <main>
      <p><a href={`/p/${project.id}`}>← {project.name}</a></p>
      <h1>Feedback y reportes</h1>
      {restarts > 0 && <p style={{ color: "var(--gold)" }}>{restarts} solicitud(es) para empezar de cero pendientes.</p>}

      <h2 style={{ fontSize: "1.1rem" }}>Feedback ({fb.data?.pending ?? 0} pendiente(s))</h2>
      {!fb.ok && <p className="err">No se pudo leer: {fb.message}</p>}
      <div style={{ display: "grid", gap: 10 }}>
        {(fb.data?.feedback ?? []).map((f) => (
          <div key={f.id} className="card" style={f.done ? { opacity: 0.55 } : undefined}>
            <span className="tag">{f.cat === "reinicio" ? "empezar de cero" : f.cat}</span>
            <strong>{f.n || "Sin nombre"}</strong> <span className="muted">{when(f.at)}{f.v ? ` · v${f.v}` : ""}</span>
            <div style={{ whiteSpace: "pre-wrap", marginTop: 4 }}>{f.text}</div>
            {owner && (
              <ItemActions projectId={project.id} id={f.id} done={f.done} kind="feedback"
                           restartFor={f.cat === "reinicio" ? f.p : undefined} />
            )}
          </div>
        ))}
        {fb.ok && (fb.data?.feedback ?? []).length === 0 && <p className="muted">Sin feedback todavía.</p>}
      </div>

      <h2 style={{ fontSize: "1.1rem", marginTop: 32 }}>Reportes de pelea ({rp.data?.pending ?? 0} pendiente(s))</h2>
      {!rp.ok && <p className="err">No se pudo leer: {rp.message}</p>}
      <div style={{ display: "grid", gap: 10 }}>
        {(rp.data?.reports ?? []).map((r) => (
          <div key={r.id} className="card" style={r.done ? { opacity: 0.55 } : undefined}>
            <span className="tag">{r.kind}</span><span className="tag">{r.cat}</span>
            <strong>{r.n || "Sin nombre"}</strong> <span className="muted">{when(r.at)}{r.v ? ` · v${r.v}` : ""}</span>
            {r.text && <div style={{ whiteSpace: "pre-wrap", marginTop: 4 }}>{r.text}</div>}
            {r.info && <div className="muted" style={{ fontSize: ".85rem" }}>{r.info}</div>}
            {owner && (
              <ItemActions projectId={project.id} id={r.id} done={r.done} kind="report"
                           downloadHref={`/p/${project.id}/feedback/report/${r.id}`} />
            )}
          </div>
        ))}
        {rp.ok && (rp.data?.reports ?? []).length === 0 && <p className="muted">Sin reportes todavía.</p>}
      </div>
    </main>
  );
}
