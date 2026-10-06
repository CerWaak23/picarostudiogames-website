import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { backendFor } from "@/lib/backends";
import { audit } from "@/lib/audit";

type Row = {
  id: string; name: string; level: number; last: number; reps: number; streak: number;
  banned: boolean; hidden: boolean; noProfile?: boolean;
};
type Found = { ok?: boolean; reason?: string; total?: number; players?: Row[] };

const nf = new Intl.NumberFormat("es-CL");
const day = (unix: number) => (unix ? new Date(unix * 1000).toLocaleDateString("es-CL", { timeZone: "America/Santiago" }) : "—");

export default async function Players(props: {
  params: Promise<{ project: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const session = await auth();
  let access;
  try {
    access = requireAccess(session?.user?.email, params.project);
  } catch {
    notFound();
  }
  const { project } = access;
  if (!project.modules.includes("players")) notFound();

  const q = (searchParams.q ?? "").slice(0, 40);
  const res = await backendFor(project).call({ action: "players.search", params: { q } });
  audit({ who: session!.user!.email!, project: project.id, action: "players.search", detail: { q } });
  const out = res.ok ? (res.data as Found) : null;

  return (
    <main>
      <p><a href={`/p/${project.id}`}>← {project.name}</a></p>
      <h1>Jugadores</h1>
      <form method="get" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          name="q"
          defaultValue={q}
          placeholder="Nombre o inicio del id"
          maxLength={40}
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid var(--surface-2)", background: "var(--surface)", color: "var(--text)", fontSize: "1rem" }}
        />
        <button className="btn">Buscar</button>
      </form>

      {!out || out.ok === false ? (
        <p className="err">No se pudo buscar: {res.error ?? out?.reason ?? "error"}</p>
      ) : (
        <>
          <p className="muted">{nf.format(out.total ?? 0)} jugadores{(out.total ?? 0) > (out.players?.length ?? 0) ? ` (mostrando ${out.players?.length})` : ""}</p>
          <div className="card" style={{ padding: 0, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
              <thead>
                <tr className="muted" style={{ textAlign: "left" }}>
                  <th style={th}>Jugador</th><th style={th}>Nivel</th><th style={th}>Reps</th><th style={th}>Racha</th><th style={th}>Visto</th>
                </tr>
              </thead>
              <tbody>
                {out.players?.map((p) => (
                  <tr key={p.id} style={{ borderTop: "1px solid var(--surface-2)" }}>
                    <td style={td}>
                      <a href={`/p/${project.id}/players/${p.id}`}>{p.name || "Sin nombre"}</a>
                      {p.banned && <span className="tag">baneado</span>}
                      {p.hidden && <span className="tag">oculto</span>}
                      {p.noProfile && <span className="tag">sin perfil</span>}
                      <div className="muted" style={{ fontSize: ".75rem" }}>{p.id}</div>
                    </td>
                    <td style={td}>{p.level}</td>
                    <td style={td}>{nf.format(p.reps)}</td>
                    <td style={td}>{p.streak}</td>
                    <td style={td}>{day(p.last)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}

const th: React.CSSProperties = { padding: "10px 12px", fontWeight: 500, fontSize: ".8rem" };
const td: React.CSSProperties = { padding: "10px 12px", verticalAlign: "top" };
