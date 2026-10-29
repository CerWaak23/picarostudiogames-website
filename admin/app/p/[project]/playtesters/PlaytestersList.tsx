"use client";

import { useMemo, useState } from "react";

export type Person = {
  email: string;
  name?: string;
  platform?: string;
  source?: string;
  lang?: string;
  at: number;
  updated?: number;
  /** Ya formateadas en el servidor: toLocaleString no da lo mismo en Node que en el navegador. */
  atLabel: string;
  updatedLabel?: string;
};

const PLATFORM: Record<string, string> = { android: "Android", ios: "iOS" };

/** and•••@gmail.com: alcanza para reconocer a alguien sin dejar el correo entero a la vista. */
function mask(email: string) {
  const at = email.lastIndexOf("@");
  if (at < 1) return "•••";
  const user = email.slice(0, at);
  const head = user.slice(0, Math.min(3, Math.max(1, user.length - 1)));
  return `${head}${"•".repeat(Math.max(3, user.length - head.length))}${email.slice(at)}`;
}

const csvCell = (v: string) => (/[",;\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

export default function PlaytestersList({ people, game }: { people: Person[]; game: string }) {
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(false);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return people;
    return people.filter((p) =>
      [p.email, p.name ?? "", PLATFORM[p.platform ?? ""] ?? ""].join(" ").toLowerCase().includes(needle),
    );
  }, [people, q]);

  function exportCsv() {
    const head = ["fecha", "correo", "nombre", "plataforma", "idioma", "origen"];
    const body = rows.map((p) =>
      [
        new Date((p.at || 0) * 1000).toISOString(),
        p.email,
        p.name ?? "",
        PLATFORM[p.platform ?? ""] ?? "",
        p.lang ?? "",
        p.source ?? "",
      ].map(csvCell).join(","),
    );
    // BOM para que Excel en Windows no rompa las tildes.
    const blob = new Blob(["﻿" + [head.join(","), ...body].join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `playtesting-${game.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const byPlatform = people.reduce<Record<string, number>>((acc, p) => {
    const k = p.platform || "sin";
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <dl className="stats" style={{ marginBottom: 18 }}>
        <div className="stat"><dt>Anotados</dt><dd>{people.length}</dd></div>
        <div className="stat"><dt>Android</dt><dd>{byPlatform.android ?? 0}</dd></div>
        <div className="stat"><dt>iOS</dt><dd>{byPlatform.ios ?? 0}</dd></div>
        <div className="stat"><dt>Sin decir</dt><dd>{byPlatform.sin ?? 0}</dd></div>
      </dl>

      <div className="cluster" style={{ flexWrap: "nowrap", marginBottom: 14 }}>
        <input
          className="input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Correo, nombre o plataforma"
          maxLength={60}
          aria-label="Buscar en la lista de espera"
        />
        <button className="btn quiet" onClick={() => setShown((s) => !s)} aria-pressed={shown}>
          {shown ? "Tapar correos" : "Ver correos"}
        </button>
        <button className="btn" onClick={exportCsv} disabled={rows.length === 0}>CSV</button>
      </div>

      <p className="faint" style={{ fontSize: "0.82rem", marginBottom: 10 }}>
        {q ? `${rows.length} de ${people.length}` : `${people.length} en la lista`}
        {" · el CSV baja lo que estás viendo, con los correos completos"}
      </p>

      {rows.length === 0 ? (
        <div className="panel empty"><strong>Nadie calza con eso.</strong>Prueba con otra parte del correo o del nombre.</div>
      ) : (
        <div className="panel rows">
          {rows.map((p) => (
            <div key={p.email} className="row">
              <div className="main">
                <div className="title">
                  {p.name || <span className="muted">Sin nombre</span>}
                  {p.platform && <span className="badge">{PLATFORM[p.platform] ?? p.platform}</span>}
                  {p.lang === "en" && <span className="badge">EN</span>}
                </div>
                <div className="sub mono">{shown ? p.email : mask(p.email)}</div>
              </div>
              <div className="aside">
                <div>{p.atLabel}</div>
                {p.updatedLabel ? <div className="faint">cambió {p.updatedLabel}</div> : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
