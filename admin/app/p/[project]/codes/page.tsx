import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { runAdmin } from "@/lib/run";
import { CodeForm, PauseButton } from "./CodesClient";

type Code = {
  code: string; crystals: number; gold: number; passDays: number;
  maxUses: number; uses: number; created: number; expires: number; note?: string; paused: boolean;
};

const nf = new Intl.NumberFormat("es-CL");
const date = (unix: number) => new Date(unix * 1000).toLocaleDateString("es-CL", { timeZone: "America/Santiago", day: "numeric", month: "short", year: "numeric" });

function status(c: Code, now: number): [string, string] {
  if (c.paused) return ["Pausado", ""];
  if (c.expires > 0 && c.expires < now) return ["Vencido", "danger"];
  if (c.maxUses > 0 && c.uses >= c.maxUses) return ["Agotado", "danger"];
  return ["Activo", "ok"];
}

export default async function Codes(props: { params: Promise<{ project: string }> }) {
  const params = await props.params;
  const session = await auth();
  let access;
  try {
    access = requireAccess(session?.user?.email, params.project);
  } catch {
    notFound();
  }
  const { project, role } = access;
  if (!project.modules.includes("codes")) notFound();

  const res = await runAdmin<{ codes?: Code[] }>(project.id, "codes.list", {}, { log: false });
  const codes = res.data?.codes ?? [];
  const now = Math.floor(Date.now() / 1000);
  const totalUses = codes.reduce((s, c) => s + c.uses, 0);

  return (
    <>
      <div className="page-head">
        <h1>Códigos canjeables</h1>
        <p>Para influencers y regalos. Cada jugador puede canjear un código una sola vez.</p>
      </div>

      {role === "owner" ? (
        <div className="panel">
          <details className="fold">
            <summary>Crear un código</summary>
            <div className="fold-body"><CodeForm projectId={project.id} /></div>
          </details>
        </div>
      ) : (
        <p className="notice">Vista de solo lectura.</p>
      )}

      <section className="section">
        <div className="section-title"><h2>Códigos</h2><span>{codes.length} · {nf.format(totalUses)} canjes</span></div>
        {!res.ok && <p className="notice err">No se pudo leer: {res.message}</p>}
        {res.ok && codes.length === 0 ? (
          <div className="panel empty"><strong>Aún no hay códigos.</strong>Crea uno y repártelo con criterio.</div>
        ) : (
          <div className="panel rows">
            {codes.map((c) => {
              const [label, tone] = status(c, now);
              const prize = [c.crystals && `${nf.format(c.crystals)} cristales`, c.gold && `${nf.format(c.gold)} oro`, c.passDays && `${c.passDays} días de pase`].filter(Boolean).join(" + ");
              return (
                <div key={c.code} className="row" style={{ alignItems: "flex-start", flexDirection: "column", gap: 6 }}>
                  <div className="cluster" style={{ justifyContent: "space-between", width: "100%", flexWrap: "nowrap" }}>
                    <strong className="mono" style={{ fontSize: "1rem", letterSpacing: "0.06em" }}>{c.code}</strong>
                    <span className={`badge ${tone}`}>{label}</span>
                  </div>
                  <div>{prize}</div>
                  <div className="faint" style={{ fontSize: "0.82rem" }}>
                    {c.maxUses > 0 ? `${c.uses} de ${c.maxUses} usos` : `${c.uses} usos`} · {c.expires > 0 ? `vence ${date(c.expires)}` : "no vence"} · creado {date(c.created)}
                    {c.note ? ` · ${c.note}` : ""}
                  </div>
                  {role === "owner" && <PauseButton projectId={project.id} code={c.code} paused={c.paused} />}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
