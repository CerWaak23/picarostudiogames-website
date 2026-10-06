import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { runAdmin } from "@/lib/run";
import { AddAdmin, RemoveAdmin } from "./AdminControls";

type Admin = { id: string; name: string; base: boolean; panel: boolean; at: number; by: string };
type Player = { id: string; name: string };

const date = (unix: number) => new Date(unix * 1000).toLocaleDateString("es-CL", { timeZone: "America/Santiago", day: "numeric", month: "short", year: "numeric" });

export default async function Admins(props: { params: Promise<{ project: string }> }) {
  const params = await props.params;
  const session = await auth();
  let access;
  try {
    access = requireAccess(session?.user?.email, params.project);
  } catch {
    notFound();
  }
  const { project, role } = access;
  if (!project.modules.includes("admins")) notFound();

  const [list, found] = await Promise.all([
    runAdmin<{ admins?: Admin[] }>(project.id, "admins.list", {}, { log: false }),
    role === "owner" ? runAdmin<{ players?: Player[] }>(project.id, "players.search", { q: "" }, { log: false }) : null,
  ]);
  const admins = list.data?.admins ?? [];
  const adminIds = new Set(admins.map((a) => a.id));
  const candidates = (found?.data?.players ?? []).filter((p) => !adminIds.has(p.id)).map((p) => ({ id: p.id, name: p.name }));

  return (
    <>
      <div className="page-head">
        <h1>Administradores</h1>
        <p>Quién puede moderar el juego desde la app y desde el servidor. Los dueños del panel web se definen en su configuración, no aquí.</p>
      </div>

      {!list.ok && <p className="notice err">No se pudo leer: {list.message}</p>}
      <div className="panel rows">
        {admins.map((a) => (
          <div key={a.id} className="row">
            <div className="main">
              <div className="title">
                {a.name || "Sin nombre"}
                {a.panel && <span className="badge gold">panel web</span>}
                {a.base && !a.panel && <span className="badge">fijo</span>}
              </div>
              <div className="sub">
                <span className="mono">{a.id.slice(0, 8)}</span>
                {a.at > 0 ? ` · agregado el ${date(a.at)}` : a.base ? " · definido en el código de los scripts" : ""}
              </div>
            </div>
            {role === "owner" && !a.base && <RemoveAdmin projectId={project.id} id={a.id} />}
          </div>
        ))}
      </div>

      {role === "owner" && (
        <section className="section">
          <div className="section-title"><h2>Agregar administrador</h2></div>
          <div className="panel pad"><AddAdmin projectId={project.id} candidates={candidates} /></div>
        </section>
      )}
    </>
  );
}
