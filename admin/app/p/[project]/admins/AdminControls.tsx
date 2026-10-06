"use client";

import { useState, useTransition } from "react";
import { setAdmin } from "./actions";

type Player = { id: string; name: string };

export function AddAdmin({ projectId, candidates }: { projectId: string; candidates: Player[] }) {
  const [pending, start] = useTransition();
  const [pick, setPick] = useState("");
  const [sure, setSure] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const chosen = candidates.find((c) => c.id === pick);

  const add = () =>
    start(async () => {
      const r = await setAdmin(projectId, pick, true);
      setMsg({ ok: r.ok, text: r.ok ? "Listo: ya es administrador" : r.message });
      setSure(false);
      if (r.ok) setPick("");
    });

  if (candidates.length === 0) return <p className="faint">No hay otros jugadores para promover.</p>;
  return (
    <div className="stack">
      <label className="field">Jugador
        <select className="select" value={pick} onChange={(e) => { setPick(e.target.value); setSure(false); }}>
          <option value="">Elige a quién…</option>
          {candidates.map((c) => <option key={c.id} value={c.id}>{c.name || "Sin nombre"} · {c.id.slice(0, 6)}</option>)}
        </select>
      </label>
      {msg && <p className={`notice ${msg.ok ? "ok" : "err"}`} role="status">{msg.text}</p>}
      {sure ? (
        <div className="notice gold stack" style={{ gap: 10 }}>
          <span>
            <strong>{chosen?.name || pick.slice(0, 6)}</strong> podrá banear, regalar, reiniciar cuentas y ver todo el panel de moderación del juego.
          </span>
          <span className="cluster">
            <button className="btn" disabled={pending} onClick={add}>Sí, hacer administrador</button>
            <button className="btn quiet" onClick={() => setSure(false)}>Cancelar</button>
          </span>
        </div>
      ) : (
        <div><button className="btn" disabled={!pick || pending} onClick={() => setSure(true)}>Hacer administrador…</button></div>
      )}
    </div>
  );
}

export function RemoveAdmin({ projectId, id }: { projectId: string; id: string }) {
  const [pending, start] = useTransition();
  const [sure, setSure] = useState(false);
  const [err, setErr] = useState("");

  const remove = () =>
    start(async () => {
      const r = await setAdmin(projectId, id, false);
      if (!r.ok) setErr(r.message);
      setSure(false);
    });

  return (
    <div className="cluster">
      {sure ? (
        <>
          <button className="btn danger sm" disabled={pending} onClick={remove}>Sí, quitar</button>
          <button className="btn quiet sm" onClick={() => setSure(false)}>Cancelar</button>
        </>
      ) : (
        <button className="btn quiet sm danger-text" onClick={() => setSure(true)}>Quitar</button>
      )}
      {err && <span className="notice err" role="status">{err}</span>}
    </div>
  );
}
