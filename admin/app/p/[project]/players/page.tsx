import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { backendFor } from "@/lib/backends";
import { audit } from "@/lib/audit";
import Icon from "@/components/Icon";
import MarBravoPlayers from "./MarBravoPlayers";
import type { MarBravoRow } from "../kpis/MarBravoKpis";

type Row = {
  id: string; name: string; level: number; last: number; reps: number; streak: number;
  banned: boolean; hidden: boolean; noProfile?: boolean; inactive?: boolean;
};
type Found = { ok?: boolean; reason?: string; total?: number; players?: Row[] };

const nf = new Intl.NumberFormat("es-CL");
const day = (unix: number) => (unix ? new Date(unix * 1000).toLocaleDateString("es-CL", { timeZone: "America/Santiago", day: "numeric", month: "short" }) : "nunca");

export default async function Players(props: {
  params: Promise<{ project: string }>;
  searchParams: Promise<{ q?: string; ver?: string }>;
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
  // Sin abrir el juego en 7 días = inactivo: van aparte para que no ensucien la lista (2026-11-11).
  // Las cuentas abandonadas (inactivas y con 0 reps) el servidor ya las borró solo.
  const inactiveView = searchParams.ver === "inactivos";
  const inactiveCount = out?.players?.filter((p) => p.inactive).length ?? 0;
  if (out?.players) {
    const all = out.players;
    out.players = all.filter((p) => !!p.inactive === inactiveView);
    out.total = Math.max(0, (out.total ?? all.length) - (all.length - out.players.length));
  }
  const shown = out?.players?.length ?? 0;
  const base = `/p/${project.id}/players`;

  return (
    <>
      <div className="page-head">
        <h1>Jugadores</h1>
        <p>Busca por nombre o por el inicio de su id. Abre uno para ver su perfil de juego y moderarlo.</p>
      </div>

      <form method="get" className="cluster" style={{ flexWrap: "nowrap", marginBottom: 18 }}>
        <input className="input" name="q" defaultValue={q} placeholder={project.views === "marbravo" ? "Inicio del código de jugador" : "Nombre o inicio del id"} maxLength={40} aria-label="Buscar jugador" />
        <button className="btn">Buscar</button>
        {inactiveView && <input type="hidden" name="ver" value="inactivos" />}
        {q && <Link href={inactiveView ? `${base}?ver=inactivos` : base} className="btn quiet">Limpiar</Link>}
      </form>

      {(inactiveView || inactiveCount > 0) && (
        <p className="faint" style={{ fontSize: "0.82rem", marginBottom: 10 }}>
          {inactiveView ? (
            <>Sin abrir el juego en más de 7 días. No cuentan en las métricas. <Link href={q ? `${base}?q=${encodeURIComponent(q)}` : base}>Ver activos</Link></>
          ) : (
            <Link href={`${base}?ver=inactivos${q ? `&q=${encodeURIComponent(q)}` : ""}`}>{nf.format(inactiveCount)} inactivo{inactiveCount === 1 ? "" : "s"} (más de 7 días sin abrir)</Link>
          )}
        </p>
      )}

      {!out || out.ok === false ? (
        <p className="notice err">No se pudo buscar: {res.error ?? out?.reason ?? "error"}</p>
      ) : shown === 0 ? (
        <div className="panel empty">
          <strong>{q ? "Nadie con ese nombre." : inactiveView ? "No hay jugadores inactivos." : "Aún no hay jugadores."}</strong>
          {q ? "Prueba con otra parte del nombre o con el id." : "Cuando alguien abra el juego aparecerá aquí."}
        </div>
      ) : (
        <>
          <p className="faint" style={{ fontSize: "0.82rem", marginBottom: 10 }}>
            {nf.format(out.total ?? shown)} jugador{(out.total ?? shown) === 1 ? "" : "es"}
            {(out.total ?? 0) > shown ? `, mostrando ${shown}` : ""}
          </p>
          {project.views === "marbravo" ? (
            <MarBravoPlayers base={`/p/${project.id}/players`} rows={out.players as unknown as MarBravoRow[]} />
          ) : (
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
          )}
        </>
      )}
    </>
  );
}
