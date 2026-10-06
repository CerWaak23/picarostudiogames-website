import Link from "next/link";
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

const when = (unix: number) => new Date(unix * 1000).toLocaleString("es-CL", { timeZone: "America/Santiago", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

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
  const labels = m ? (m.k === "stars" ? ["1 estrella", "2 estrellas", "3 estrellas", "4 estrellas", "5 estrellas"] : m.o) : [];
  const tally = r.data?.tally ?? [];
  const top = Math.max(1, ...tally);

  return (
    <>
      <Link href={`/p/${project.id}/messages`} className="crumb">← Mensajes</Link>
      {!m ? (
        <p className="notice err">No se pudo leer: {r.message}</p>
      ) : (
        <>
          <div className="page-head">
            <h1>{m.t}</h1>
            <p>{when(m.at)} · {m.to ? "mensaje personal" : "para todos"}</p>
          </div>
          <div className="panel pad" style={{ whiteSpace: "pre-wrap" }}>{m.b}</div>

          {m.k !== "none" && (
            <section className="section">
              <div className="section-title"><h2>Respuestas</h2><span>{m.answers}</span></div>
              {m.k !== "text" && tally.length > 0 && (
                <div className="panel pad stack" style={{ gap: 12, marginBottom: 14 }}>
                  {labels.map((l, i) => (
                    <div key={i}>
                      <div className="cluster" style={{ justifyContent: "space-between", flexWrap: "nowrap" }}>
                        <span>{l}</span><span className="muted">{tally[i] ?? 0}</span>
                      </div>
                      <div style={{ background: "var(--surface-2)", borderRadius: 4, height: 6, marginTop: 6 }}>
                        <div style={{ width: `${((tally[i] ?? 0) / top) * 100}%`, background: "var(--gold)", height: 6, borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {(r.data?.results ?? []).length === 0 ? (
                <div className="panel empty"><strong>Nadie ha respondido.</strong>Los jugadores lo ven al abrir el juego.</div>
              ) : (
                <div className="panel rows">
                  {r.data!.results!.map((a) => (
                    <div key={a.id} className="row" style={{ alignItems: "flex-start" }}>
                      <div className="main">
                        <div className="title">{a.name || "Sin nombre"}</div>
                        <div className="sub" style={{ color: "var(--text)", marginTop: 4 }}>{a.text || a.picks.map((p) => labels[p]).filter(Boolean).join(", ")}</div>
                      </div>
                      <div className="aside faint">{when(a.at)}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
          {role === "owner" && <DeleteButton projectId={project.id} id={m.id} />}
        </>
      )}
    </>
  );
}
