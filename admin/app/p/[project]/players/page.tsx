import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { backendFor } from "@/lib/backends";
import { audit } from "@/lib/audit";
import Icon from "@/components/Icon";

type Row = {
  id: string; name: string; level: number; last: number; reps: number; streak: number;
  banned: boolean; hidden: boolean; noProfile?: boolean;
};
type Found = { ok?: boolean; reason?: string; total?: number; players?: Row[] };

const nf = new Intl.NumberFormat("es-CL");
const day = (unix: number) => (unix ? new Date(unix * 1000).toLocaleDateString("es-CL", { timeZone: "America/Santiago", day: "numeric", month: "short" }) : "nunca");

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
  const shown = out?.players?.length ?? 0;

  return (
    <>
      <div className="page-head">
        <h1>Jugadores</h1>
        <p>Busca por nombre o por el inicio de su id. Abre uno para ver su perfil de juego y moderarlo.</p>
      </div>

      <form method="get" className="cluster" style={{ flexWrap: "nowrap", marginBottom: 18 }}>
        <input className="input" name="q" defaultValue={q} placeholder="Nombre o inicio del id" maxLength={40} aria-label="Buscar jugador" />
        <button className="btn">Buscar</button>
        {q && <Link href={`/p/${project.id}/players`} className="btn quiet">Limpiar</Link>}
      </form>

      {!out || out.ok === false ? (
        <p className="notice err">No se pudo buscar: {res.error ?? out?.reason ?? "error"}</p>
      ) : shown === 0 ? (
        <div className="panel empty">
          <strong>{q ? "Nadie con ese nombre." : "Aún no hay jugadores."}</strong>
          {q ? "Prueba con otra parte del nombre o con el id." : "Cuando alguien abra el juego aparecerá aquí."}
        </div>
      ) : (
        <>
          <p className="faint" style={{ fontSize: "0.82rem", marginBottom: 10 }}>
            {nf.format(out.total ?? shown)} jugador{(out.total ?? shown) === 1 ? "" : "es"}
            {(out.total ?? 0) > shown ? `, mostrando ${shown}` : ""}
          </p>
          <div className="panel rows">
            {out.players!.map((p) => (
              <Link key={p.id} href={`/p/${project.id}/players/${p.id}`} className="row">
                <div className="main">
                  <div className="title">
                    {p.name || "Sin nombre"}
                    {p.banned && <span className="badge danger">baneado</span>}
                    {p.hidden && <span className="badge">oculto</span>}
                    {p.noProfile && <span className="badge">sin perfil</span>}
                  </div>
                  <div className="sub"><span className="mono">{p.id.slice(0, 8)}</span> · visto {day(p.last)}</div>
                </div>
                <div className="aside">
                  <div>Nivel {p.level}</div>
                  <div className="faint">{nf.format(p.reps)} reps{p.streak > 0 ? ` · racha ${p.streak}` : ""}</div>
                </div>
                <Icon name="chevron" className="chev" />
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
