import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { runAdmin } from "@/lib/run";
import Compose from "./Compose";

type Sent = { id: string; t: string; b: string; k: string; at: number; to: string; toName?: string; answers: number };
type Player = { id: string; name: string };

const KIND: Record<string, string> = { none: "aviso", text: "texto", one: "una opción", many: "varias", stars: "nota 1-5" };
const when = (unix: number) => new Date(unix * 1000).toLocaleString("es-CL", { timeZone: "America/Santiago", dateStyle: "short", timeStyle: "short" });

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
    <main>
      <p><a href={`/p/${project.id}`}>← {project.name}</a></p>
      <h1>Mensajes</h1>
      {role === "owner" ? <Compose projectId={project.id} players={players} /> : <p className="muted">Solo lectura.</p>}

      <h2 style={{ fontSize: "1.1rem", marginTop: 28 }}>Enviados</h2>
      {!list.ok && <p className="err">No se pudo leer: {list.message}</p>}
      <div style={{ display: "grid", gap: 10 }}>
        {sent.map((m) => (
          <a key={m.id} href={`/p/${project.id}/messages/${m.id}`} className="card">
            <strong>{m.t}</strong>
            <div className="muted" style={{ fontSize: ".85rem" }}>
              {when(m.at)} · para {m.to ? m.toName || m.to.slice(0, 6) : "todos"} · {KIND[m.k] ?? m.k}
              {m.k !== "none" && ` · ${m.answers} respuesta(s)`}
            </div>
          </a>
        ))}
        {list.ok && sent.length === 0 && <p className="muted">Todavía no has enviado mensajes.</p>}
      </div>
    </main>
  );
}
