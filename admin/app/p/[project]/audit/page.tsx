import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { runAdmin } from "@/lib/run";
import { labelFor } from "@/lib/auditLabels";

type Item = { at: number; who: string; project: string; action: string; target: string; detail: string; ok: boolean; kind: "read" | "write" };
type Res = { month?: string; total?: number; items?: Item[] };

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const when = (unix: number) => new Date(unix * 1000).toLocaleString("es-CL", { timeZone: "America/Santiago", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" });

/** Últimos 6 meses (hora de Chile), el más reciente primero. */
function lastMonths(): { id: string; label: string }[] {
  const out: { id: string; label: string }[] = [];
  const d = new Date();
  for (let i = 0; i < 6; i++) {
    const m = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1));
    out.push({
      id: `${m.getUTCFullYear()}-${String(m.getUTCMonth() + 1).padStart(2, "0")}`,
      label: m.toLocaleDateString("es-CL", { timeZone: "UTC", month: "long", year: "numeric" }),
    });
  }
  return out;
}

function prettyDetail(detail: string): string {
  try {
    const o = JSON.parse(detail) as Record<string, unknown>;
    return Object.entries(o).filter(([k, v]) => k !== "ok" && v !== undefined && v !== null && v !== "").map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`).join(" · ");
  } catch {
    return detail;
  }
}

export default async function Audit(props: { params: Promise<{ project: string }>; searchParams: Promise<{ m?: string; all?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const session = await auth();
  let access;
  try {
    access = requireAccess(session?.user?.email, params.project, "owner");
  } catch {
    notFound();
  }
  const { project } = access;
  if (!project.modules.includes("audit")) notFound();

  const months = lastMonths();
  const month = searchParams.m && MONTH.test(searchParams.m) ? searchParams.m : months[0].id;
  const showAll = searchParams.all === "1";

  const res = await runAdmin<Res>(project.id, "audit.list", { month }, { log: false });
  const all = res.data?.items ?? [];
  const items = showAll ? all : all.filter((i) => i.kind !== "read");
  const hiddenReads = all.length - items.length;
  const q = (m: string, a: boolean) => `/p/${project.id}/audit?m=${m}${a ? "&all=1" : ""}`;

  return (
    <>
      <div className="page-head">
        <h1>Auditoría</h1>
        <p>Todo lo que se hace desde el panel, con quién, cuándo y sobre quién. No se puede editar ni borrar desde aquí.</p>
      </div>

      <div className="cluster" style={{ marginBottom: 18 }}>
        {months.map((m) => (
          <Link key={m.id} href={q(m.id, showAll)} className={`btn sm ${m.id === month ? "" : "quiet"}`}>{m.label}</Link>
        ))}
      </div>
      <div className="cluster" style={{ marginBottom: 14 }}>
        <Link href={q(month, false)} className={`btn sm ${showAll ? "quiet" : ""}`}>Solo cambios</Link>
        <Link href={q(month, true)} className={`btn sm ${showAll ? "" : "quiet"}`}>Todo, con lecturas</Link>
      </div>

      {!res.ok && <p className="notice err">No se pudo leer: {res.message}</p>}
      {res.ok && items.length === 0 ? (
        <div className="panel empty">
          <strong>Sin movimientos en este mes.</strong>
          {hiddenReads > 0 ? `Hay ${hiddenReads} lecturas ocultas; usa "Todo, con lecturas".` : "Cuando hagas algo desde el panel, queda anotado aquí."}
        </div>
      ) : (
        <>
          <p className="faint" style={{ fontSize: "0.82rem", marginBottom: 10 }}>
            {items.length} evento{items.length === 1 ? "" : "s"}{!showAll && hiddenReads > 0 ? `, ${hiddenReads} lecturas ocultas` : ""}
            {(res.data?.total ?? 0) > all.length ? ` · se muestran los ${all.length} más recientes` : ""}
          </p>
          <div className="panel rows">
            {items.map((i, n) => (
              <div key={`${i.at}-${n}`} className="row" style={{ alignItems: "flex-start", flexDirection: "column", gap: 4 }}>
                <div className="cluster" style={{ justifyContent: "space-between", width: "100%", flexWrap: "nowrap" }}>
                  <strong>
                    {labelFor(i.action)}
                    {!i.ok && <span className="badge danger">falló</span>}
                    {i.kind === "read" && <span className="badge">lectura</span>}
                  </strong>
                  <span className="faint" style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>{when(i.at)}</span>
                </div>
                <div className="faint" style={{ fontSize: "0.84rem", overflowWrap: "anywhere" }}>
                  {i.who}
                  {i.target ? <> · <span className="mono">{i.target.length > 14 ? `${i.target.slice(0, 8)}…` : i.target}</span></> : null}
                </div>
                {i.detail && i.detail !== "{}" && <div className="muted" style={{ fontSize: "0.84rem", overflowWrap: "anywhere" }}>{prettyDetail(i.detail)}</div>}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
