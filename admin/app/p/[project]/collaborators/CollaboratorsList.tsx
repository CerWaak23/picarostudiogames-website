"use client";

import { useMemo, useState, useTransition } from "react";
import { markDone } from "./actions";

export type Person = {
  key: string;
  email: string;
  name: string;
  area?: string;
  link?: string;
  note?: string;
  lang?: string;
  at: number;
  updated?: number;
  done?: boolean;
  /** Ya formateadas en el servidor: toLocaleString no da lo mismo en Node que en el navegador. */
  atLabel: string;
  updatedLabel?: string;
};

const AREA: Record<string, string> = {
  arte: "Arte",
  musica: "Música y sonido",
  codigo: "Código",
  narrativa: "Historia",
  produccion: "Producción",
  otro: "Otra cosa",
};

/** cam•••••••@gmail.com: alcanza para reconocer a alguien sin dejar el correo entero a la vista. */
function mask(email: string) {
  const at = email.lastIndexOf("@");
  if (at < 1) return "•••";
  const user = email.slice(0, at);
  const head = user.slice(0, Math.min(3, Math.max(1, user.length - 1)));
  return `${head}${"•".repeat(Math.max(3, user.length - head.length))}${email.slice(at)}`;
}

const csvCell = (v: string) => (/[",;\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

export default function CollaboratorsList({
  people,
  pending,
  projectId,
  owner,
}: {
  people: Person[];
  pending: number;
  projectId: string;
  owner: boolean;
}) {
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(false);
  const [onlyPending, setOnlyPending] = useState(false);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return people.filter((p) => {
      if (onlyPending && p.done) return false;
      if (!needle) return true;
      return [p.name, p.email, p.note ?? "", p.link ?? "", AREA[p.area ?? ""] ?? ""].join(" ").toLowerCase().includes(needle);
    });
  }, [people, q, onlyPending]);

  function exportCsv() {
    const head = ["fecha", "nombre", "correo", "area", "enlace", "mensaje", "idioma", "revisado"];
    const body = rows.map((p) =>
      [
        new Date((p.at || 0) * 1000).toISOString(),
        p.name,
        p.email,
        AREA[p.area ?? ""] ?? "",
        p.link ?? "",
        (p.note ?? "").replace(/\r?\n/g, " "),
        p.lang ?? "",
        p.done ? "sí" : "no",
      ].map(csvCell).join(","),
    );
    // BOM para que Excel en Windows no rompa las tildes.
    const blob = new Blob(["﻿" + [head.join(","), ...body].join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trabajar-juntos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const byArea = people.reduce<Record<string, number>>((acc, p) => {
    const k = p.area || "otro";
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(byArea).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <>
      <dl className="stats" style={{ marginBottom: 18 }}>
        <div className="stat"><dt>Postulaciones</dt><dd>{people.length}</dd></div>
        <div className="stat"><dt>Sin revisar</dt><dd>{pending}</dd></div>
        {top.map(([k, n]) => (
          <div className="stat" key={k}><dt>{AREA[k] ?? k}</dt><dd>{n}</dd></div>
        ))}
      </dl>

      <div className="cluster" style={{ flexWrap: "nowrap", marginBottom: 14 }}>
        <input
          className="input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nombre, correo, área o mensaje"
          maxLength={60}
          aria-label="Buscar en las postulaciones"
        />
        <button className="btn quiet" onClick={() => setShown((s) => !s)} aria-pressed={shown}>
          {shown ? "Tapar correos" : "Ver correos"}
        </button>
        <button className="btn" onClick={exportCsv} disabled={rows.length === 0}>CSV</button>
      </div>

      <div className="cluster" style={{ marginBottom: 10 }}>
        <button className="btn quiet sm" onClick={() => setOnlyPending((v) => !v)} aria-pressed={onlyPending}>
          {onlyPending ? "Ver todas" : "Solo sin revisar"}
        </button>
        <span className="faint" style={{ fontSize: "0.82rem" }}>
          {q || onlyPending ? `${rows.length} de ${people.length}` : `${people.length} en total`}
          {" · el CSV baja lo que estás viendo, con los correos completos"}
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="panel empty"><strong>Nadie calza con eso.</strong>Prueba con otra palabra o saca el filtro.</div>
      ) : (
        <div className="panel rows">
          {rows.map((p) => (
            <div key={p.key} className="row" style={{ alignItems: "flex-start", flexDirection: "column", gap: 6, opacity: p.done ? 0.55 : 1 }}>
              <div className="cluster" style={{ justifyContent: "space-between", width: "100%" }}>
                <span>
                  <strong>{p.name}</strong>
                  <span className="badge">{AREA[p.area ?? ""] ?? "Otra cosa"}</span>
                  {p.lang === "en" && <span className="badge">EN</span>}
                  {p.done && <span className="badge ok">revisado</span>}
                </span>
                <span className="faint" style={{ fontSize: "0.82rem" }}>
                  {p.atLabel}
                  {p.updatedLabel ? ` · cambió ${p.updatedLabel}` : ""}
                </span>
              </div>

              <div className="mono" style={{ overflowWrap: "anywhere" }}>
                {shown ? <a href={`mailto:${p.email}`}>{p.email}</a> : mask(p.email)}
              </div>

              {p.link && (
                <div style={{ overflowWrap: "anywhere" }}>
                  {/* noreferrer: el enlace lo escribió alguien de afuera. */}
                  <a href={p.link} target="_blank" rel="noopener noreferrer nofollow">{p.link}</a>
                </div>
              )}

              {p.note && <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{p.note}</div>}

              {owner && <DoneButton projectId={projectId} entry={p} />}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function DoneButton({ projectId, entry }: { projectId: string; entry: Person }) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");
  return (
    <div className="cluster">
      <button
        className="btn quiet sm"
        disabled={pending}
        onClick={() => start(async () => {
          const r = await markDone(projectId, entry.key, !entry.done);
          setErr(r.ok ? "" : r.message);
        })}
      >
        {entry.done ? "Volver a pendiente" : "Marcar revisado"}
      </button>
      {err && <span className="notice err" role="status">{err}</span>}
    </div>
  );
}
