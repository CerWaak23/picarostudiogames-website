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
    <div className="cluster" style={{ marginTop: 4 }}>
      <button className="btn quiet sm" disabled={pending}
              onClick={() => go(() => (kind === "feedback" ? markFeedback(projectId, id, !done) : markReport(projectId, id, !done)))}>
        {done ? "Marcar pendiente" : "Marcar revisado"}
      </button>
      {downloadHref && <a className="btn quiet sm" href={downloadHref}>Descargar datos</a>}
      {restartFor && !done && (sure ? (
        <>
          <button className="btn danger sm" disabled={pending} onClick={() => go(() => acceptRestart(projectId, id, restartFor))}>Sí, reiniciar su cuenta</button>
          <button className="btn quiet sm" onClick={() => setSure(false)}>Cancelar</button>
        </>
      ) : (
        <button className="btn quiet sm danger-text" onClick={() => setSure(true)}>Aceptar y reiniciar</button>
      ))}
      {err && <span className="notice err" role="status">{err}</span>}
    </div>
  );
}
