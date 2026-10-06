"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteMessage } from "../actions";

export default function DeleteButton({ projectId, id }: { projectId: string; id: string }) {
  const [pending, start] = useTransition();
  const [sure, setSure] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();

  const del = () =>
    start(async () => {
      const r = await deleteMessage(projectId, id);
      if (r.ok) router.push(`/p/${projectId}/messages`);
      else setErr(r.message);
    });

  return (
    <div className="section">
      {err && <p className="notice err" style={{ marginBottom: 10 }}>{err}</p>}
      {sure ? (
        <span className="cluster">
          <button className="btn danger" disabled={pending} onClick={del}>Sí, borrar mensaje</button>
          <button className="btn quiet" onClick={() => setSure(false)}>Cancelar</button>
        </span>
      ) : (
        <button className="btn quiet danger-text" onClick={() => setSure(true)}>Borrar mensaje</button>
      )}
    </div>
  );
}
