"use client";

import { useState, useTransition } from "react";
import { acceptRestart, markFeedback, markReport } from "./actions";

type Props = { projectId: string; id: string; done: boolean; kind: "feedback" | "report"; restartFor?: string; downloadHref?: string };

export default function ItemActions({ projectId, id, done, kind, restartFor, downloadHref }: Props) {
  const [pending, start] = useTransition();
  const [sure, setSure] = useState(false);
  const [err, setErr] = useState("");

  const go = (f: () => Promise<{ ok: boolean; message: string }>) =>
    start(async () => {
      const r = await f();
      setErr(r.ok ? "" : r.message);
      setSure(false);
    });

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8, alignItems: "center" }}>
      <button className="btn ghost" disabled={pending}
              onClick={() => go(() => (kind === "feedback" ? markFeedback(projectId, id, !done) : markReport(projectId, id, !done)))}>
        {done ? "Marcar pendiente" : "Marcar revisado"}
      </button>
      {downloadHref && <a className="btn ghost" href={downloadHref} style={{ display: "inline-block" }}>Descargar datos</a>}
      {restartFor && !done && (sure ? (
        <>
          <button className="btn" style={{ background: "var(--danger)", color: "#fff" }} disabled={pending}
                  onClick={() => go(() => acceptRestart(projectId, id, restartFor))}>Sí, reiniciar su cuenta</button>
          <button className="btn ghost" onClick={() => setSure(false)}>Cancelar</button>
        </>
      ) : (
        <button className="btn ghost" style={{ color: "var(--danger)" }} onClick={() => setSure(true)}>Aceptar y reiniciar</button>
      ))}
      {err && <span className="err">{err}</span>}
    </div>
  );
}
