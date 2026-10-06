"use client";

import { useState, useTransition } from "react";
import { reviewPhoto } from "./actions";

export default function PhotoActions({ projectId, target }: { projectId: string; target: string }) {
  const [pending, start] = useTransition();
  const [sure, setSure] = useState(false);
  const [err, setErr] = useState("");

  const go = (decision: "approve" | "reject") =>
    start(async () => {
      const r = await reviewPhoto(projectId, target, decision);
      if (!r.ok) setErr(r.message);
      setSure(false);
    });

  return (
    <div className="stack" style={{ gap: 8 }}>
      {err && <p className="notice err" role="status">{err}</p>}
      {sure ? (
        <div className="cluster" style={{ justifyContent: "center" }}>
          <button className="btn danger sm" disabled={pending} onClick={() => go("reject")}>Sí, rechazar</button>
          <button className="btn quiet sm" onClick={() => setSure(false)}>Cancelar</button>
        </div>
      ) : (
        <div className="cluster" style={{ justifyContent: "center" }}>
          <button className="btn sm" disabled={pending} onClick={() => go("approve")}>Aprobar</button>
          <button className="btn quiet sm danger-text" disabled={pending} onClick={() => setSure(true)}>Rechazar</button>
        </div>
      )}
    </div>
  );
}
