import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { runAdmin } from "@/lib/run";
import CommentActions from "./CommentActions";

/** Un comentario del buzón de AJUSTES de Mar Bravo (acción "reportes" de Mar Bravo/Cloud/scripts/Jugadores.js). */
type Comment = {
  tipo: number; texto: string; escena: string; ronda: number; lugar: number; version: string; aparato: string;
  j: string; t: number; revisado: boolean;
};

const TIPO = ["No me gustó", "Me gustaría", "Error"];
const BADGE = ["", "gold", "danger"];
const when = (unix: number) => new Date(unix * 1000).toLocaleString("es-CL", { timeZone: "America/Santiago", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default async function Comments(props: { params: Promise<{ project: string }>; searchParams: Promise<{ ver?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const session = await auth();
  let access;
  try {
    access = requireAccess(session?.user?.email, params.project);
  } catch {
    notFound();
  }
  const { project, role } = access;
  if (!project.modules.includes("comments")) notFound();

  const all = searchParams.ver === "todos";
  const res = await runAdmin<{ reportes?: Comment[]; total?: number; pendientes?: number }>(project.id, "comments.list", { dias: 90 }, { log: false });
  const list = (res.data?.reportes ?? []).filter((c) => all || !c.revisado);
  const base = `/p/${project.id}/comments`;

  return (
    <>
      <div className="page-head">
        <h1>Comentarios</h1>
        <p>Lo que mandan los jugadores desde el buzón de AJUSTES, con dónde estaban. Últimos 90 días.</p>
      </div>
      <div className="cluster" style={{ marginBottom: 14 }}>
        <Link href={base} className={all ? "btn quiet sm" : "btn sm"}>Sin revisar ({res.data?.pendientes ?? 0})</Link>
        <Link href={`${base}?ver=todos`} className={all ? "btn sm" : "btn quiet sm"}>Todos ({res.data?.total ?? 0})</Link>
      </div>
      {!res.ok ? (
        <p className="notice err">No se pudo leer: {res.message}</p>
      ) : list.length === 0 ? (
        <div className="panel empty"><strong>{all ? "Aún no hay comentarios." : "Nada sin revisar."}</strong>Cuando alguien escriba en el buzón aparecerá aquí.</div>
      ) : (
        <div className="panel rows">
          {list.map((c) => (
            <div key={`${c.j}:${c.t}`} className="row" style={{ alignItems: "flex-start" }}>
              <div className="main">
                <div className="title">
                  <span className={`badge ${BADGE[c.tipo] ?? ""}`}>{TIPO[c.tipo] ?? "Otro"}</span>
                  {c.revisado && <span className="badge">revisado</span>}
                </div>
                <p style={{ margin: "6px 0", whiteSpace: "pre-wrap" }}>{c.texto}</p>
                <div className="sub">
                  {when(c.t)} · {c.ronda > 0 ? `lugar ${c.lugar}, ronda ${c.ronda}` : c.escena || "sin escena"} · {c.aparato || "?"} · v{c.version || "?"} ·{" "}
                  <Link href={`/p/${project.id}/players/${c.j}`} className="mono">{c.j.slice(0, 10)}</Link>
                </div>
                {role === "owner" && <CommentActions projectId={project.id} id={`${c.j}:${c.t}`} done={c.revisado} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
