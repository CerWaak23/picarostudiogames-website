import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { runAdmin } from "@/lib/run";
import DeleteButton from "./DeleteButton";

type Res = {
  message?: { id: string; t: string; b: string; k: string; o: string[]; at: number; to: string; answers: number };
  results?: { id: string; name: string; at: number; text: string; picks: number[] }[];
  tally?: number[];
};

const when = (unix: number) => new Date(unix * 1000).toLocaleString("es-CL", { timeZone: "America/Santiago", dateStyle: "short", timeStyle: "short" });

export default async function MessageResults(props: { params: Promise<{ project: string; id: string }> }) {
  const params = await props.params;
  const session = await auth();
  let access;
  try {
    access = requireAccess(session?.user?.email, params.project);
  } catch {
    notFound();
  }
  const { project, role } = access;
  if (!project.modules.includes("messages") || !/^m[0-9]{6,20}$/.test(params.id)) notFound();

  const r = await runAdmin<Res>(project.id, "messages.results", { id: params.id }, { target: params.id });
  const m = r.data?.message;
  const labels = m ? (m.k === "stars" ? ["1 ★", "2 ★", "3 ★", "4 ★", "5 ★"] : m.o) : [];
  const tally = r.data?.tally ?? [];
  const total = Math.max(1, ...tally);

  return (
    <main>
      <p><a href={`/p/${project.id}/messages`}>← Mensajes</a></p>
      {!m ? <p className="err">No se pudo leer: {r.message}</p> : (
        <>
          <h1>{m.t}</h1>
          <p className="muted">{when(m.at)} · {m.to ? "personal" : "para todos"}</p>
          <div className="card" style={{ whiteSpace: "pre-wrap" }}>{m.b}</div>

          {m.k !== "none" && (
            <section style={{ marginTop: 24 }}>
              <h2 style={{ fontSize: "1.1rem" }}>{m.answers} respuesta(s)</h2>
              {m.k !== "text" && (
                <div className="card" style={{ display: "grid", gap: 8 }}>
                  {labels.map((l, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}><span>{l}</span><span className="muted">{tally[i] ?? 0}</span></div>
                      <div style={{ background: "var(--surface-2)", borderRadius: 4, height: 8 }}>
                        <div style={{ width: `${((tally[i] ?? 0) / total) * 100}%`, background: "var(--gold)", height: 8, borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="card" style={{ marginTop: 12 }}>
                {(r.data?.results ?? []).map((a) => (
                  <div key={a.id} style={{ padding: "6px 0", borderBottom: "1px solid var(--surface-2)" }}>
                    <strong>{a.name || "Sin nombre"}</strong> <span className="muted">{when(a.at)}</span>
                    <div>{a.text || a.picks.map((p) => labels[p]).filter(Boolean).join(", ")}</div>
                  </div>
                ))}
                {(r.data?.results ?? []).length === 0 && <span className="muted">Nadie ha respondido todavía.</span>}
              </div>
            </section>
          )}
          {role === "owner" && <DeleteButton projectId={project.id} id={m.id} />}
        </>
      )}
    </main>
  );
}
