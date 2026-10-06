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
    <div style={{ marginTop: 28 }}>
      {err && <p className="err">{err}</p>}
      {sure ? (
        <span style={{ display: "inline-flex", gap: 8 }}>
          <button className="btn" style={{ background: "var(--danger)", color: "#fff" }} disabled={pending} onClick={del}>Sí, borrar mensaje</button>
          <button className="btn ghost" onClick={() => setSure(false)}>Cancelar</button>
        </span>
      ) : (
        <button className="btn ghost" style={{ color: "var(--danger)" }} onClick={() => setSure(true)}>Borrar mensaje</button>
      )}
    </div>
  );
}
