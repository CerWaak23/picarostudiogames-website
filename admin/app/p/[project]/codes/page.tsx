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
const date = (unix: number) => new Date(unix * 1000).toLocaleDateString("es-CL", { timeZone: "America/Santiago" });

function status(c: Code, now: number): [string, string] {
  if (c.paused) return ["pausado", "var(--muted)"];
  if (c.expires > 0 && c.expires < now) return ["vencido", "var(--danger)"];
  if (c.maxUses > 0 && c.uses >= c.maxUses) return ["agotado", "var(--danger)"];
  return ["activo", "var(--gold)"];
}

export default async function Codes({ params }: { params: { project: string } }) {
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
    <main>
      <p><a href={`/p/${project.id}`}>← {project.name}</a></p>
      <h1>Códigos canjeables</h1>
      {role === "owner" ? <CodeForm projectId={project.id} /> : <p className="muted">Solo lectura.</p>}

      <h2 style={{ fontSize: "1.1rem", marginTop: 28 }}>Códigos ({codes.length}) · {nf.format(totalUses)} canjes</h2>
      {!res.ok && <p className="err">No se pudo leer: {res.message}</p>}
      <div style={{ display: "grid", gap: 10 }}>
        {codes.map((c) => {
          const [label, color] = status(c, now);
          const prize = [c.crystals && `${nf.format(c.crystals)} cristales`, c.gold && `${nf.format(c.gold)} oro`, c.passDays && `${c.passDays} días de pase`].filter(Boolean).join(" + ");
          return (
            <div key={c.code} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                <strong style={{ letterSpacing: ".05em" }}>{c.code}</strong>
                <span style={{ color }}>{label}</span>
              </div>
              <div>{prize}</div>
              <div className="muted" style={{ fontSize: ".85rem" }}>
                {c.maxUses > 0 ? `${c.uses}/${c.maxUses} usos` : `${c.uses} usos`} ·{" "}
                {c.expires > 0 ? `vence ${date(c.expires)}` : "no vence"} · creado {date(c.created)}
                {c.note ? ` · ${c.note}` : ""}
              </div>
              {role === "owner" && <div style={{ marginTop: 8 }}><PauseButton projectId={project.id} code={c.code} paused={c.paused} /></div>}
            </div>
          );
        })}
        {res.ok && codes.length === 0 && <p className="muted">Todavía no hay códigos.</p>}
      </div>
    </main>
  );
}
