import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { runAdmin } from "@/lib/run";
import Icon from "@/components/Icon";
import Compose from "./Compose";

type Sent = { id: string; t: string; b: string; k: string; at: number; to: string; toName?: string; answers: number };
type Player = { id: string; name: string };

const KIND: Record<string, string> = { none: "Aviso", text: "Texto", one: "Una opción", many: "Varias opciones", stars: "Nota 1 a 5" };
const when = (unix: number) => new Date(unix * 1000).toLocaleString("es-CL", { timeZone: "America/Santiago", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default async function Messages(props: { params: Promise<{ project: string }> }) {
  const params = await props.params;
  const session = await auth();
  let access;
  try {
    access = requireAccess(session?.user?.email, params.project);
  } catch {
    notFound();
  }
  const { project, role } = access;
  if (!project.modules.includes("messages")) notFound();

  const [list, found] = await Promise.all([
    runAdmin<{ messages?: Sent[] }>(project.id, "messages.list", {}, { log: false }),
    role === "owner" ? runAdmin<{ players?: Player[] }>(project.id, "players.search", { q: "" }, { log: false }) : null,
  ]);
  const sent = list.data?.messages ?? [];
  const players = (found?.data?.players ?? []).map((p) => ({ id: p.id, name: p.name }));

  return (
    <>
      <div className="page-head">
        <h1>Mensajes</h1>
        <p>Escribe a un jugador o a todos. Pueden contestar con texto, opciones o una nota.</p>
      </div>

      {role === "owner" ? (
        <div className="panel">
          <details className="fold" open>
            <summary>Nuevo mensaje</summary>
            <div className="fold-body"><Compose projectId={project.id} players={players} /></div>
          </details>
        </div>
      ) : (
        <p className="notice">Vista de solo lectura.</p>
      )}

      <section className="section">
        <div className="section-title"><h2>Enviados</h2><span>{sent.length}</span></div>
        {!list.ok && <p className="notice err">No se pudo leer: {list.message}</p>}
        {list.ok && sent.length === 0 ? (
          <div className="panel empty"><strong>Todavía no has mandado nada.</strong>Tu primer mensaje está esperando.</div>
        ) : (
          <div className="panel rows">
            {sent.map((m) => (
              <Link key={m.id} href={`/p/${project.id}/messages/${m.id}`} className="row">
                <div className="main">
                  <div className="title">{m.t}</div>
                  <div className="sub">{when(m.at)} · para {m.to ? m.toName || m.to.slice(0, 6) : "todos"}</div>
                </div>
                <div className="aside">
                  <span className="badge">{KIND[m.k] ?? m.k}</span>
                  {m.k !== "none" && <div className="faint" style={{ marginTop: 4 }}>{m.answers} respuesta{m.answers === 1 ? "" : "s"}</div>}
                </div>
                <Icon name="chevron" className="chev" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
