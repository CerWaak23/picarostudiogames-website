"use client";

import { useState, useTransition } from "react";
import { markComment } from "./actions";

export default function CommentActions({ projectId, id, done }: { projectId: string; id: string; done: boolean }) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");
  return (
    <div className="cluster" style={{ marginTop: 4 }}>
      <button className="btn quiet sm" disabled={pending}
              onClick={() => start(async () => { const r = await markComment(projectId, id, !done); setErr(r.ok ? "" : r.message); })}>
        {done ? "Marcar pendiente" : "Marcar revisado"}
      </button>
      {err && <span className="notice err" role="status">{err}</span>}
    </div>
  );
}
