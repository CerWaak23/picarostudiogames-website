"use client";

import { useState, useTransition } from "react";
import { sendMessage } from "./actions";

type Player = { id: string; name: string };

const KINDS: [string, string][] = [
  ["none", "Solo aviso"], ["text", "Texto libre"], ["one", "Una opción"], ["many", "Varias opciones"], ["stars", "Nota de 1 a 5"],
];

export default function Compose({ projectId, players }: { projectId: string; players: Player[] }) {
  const [pending, start] = useTransition();
  const [to, setTo] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [kind, setKind] = useState("none");
  const [options, setOptions] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const dest = to ? players.find((p) => p.id === to)?.name || to : "todos los jugadores";

  const send = () =>
    start(async () => {
      const r = await sendMessage(projectId, to, title, body, kind, options.split("\n"));
      setMsg({ ok: r.ok, text: r.ok ? "Mensaje enviado" : r.message });
      setConfirm(false);
      if (r.ok) { setTitle(""); setBody(""); setOptions(""); }
    });

  return (
    <div className="stack">
      <label className="field">Para
        <select className="select" value={to} onChange={(e) => { setTo(e.target.value); setConfirm(false); }}>
          <option value="">Todos los jugadores</option>
          {players.map((p) => <option key={p.id} value={p.id}>{p.name || "Sin nombre"} · {p.id.slice(0, 6)}</option>)}
        </select>
      </label>
      <label className="field">Título
        <input className="input" value={title} maxLength={60} onChange={(e) => setTitle(e.target.value)} placeholder="Máx. 60 caracteres" />
      </label>
      <label className="field">Texto
        <textarea className="textarea" value={body} maxLength={500} onChange={(e) => setBody(e.target.value)} placeholder="Máx. 500 caracteres" />
      </label>
      <label className="field">Cómo pueden responder
        <select className="select" value={kind} onChange={(e) => setKind(e.target.value)}>
          {KINDS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </label>
      {(kind === "one" || kind === "many") && (
        <label className="field">Opciones (una por línea, de 2 a 6)
          <textarea className="textarea" style={{ minHeight: "5rem" }} value={options} onChange={(e) => setOptions(e.target.value)} />
        </label>
      )}
      {msg && <p className={`notice ${msg.ok ? "ok" : "err"}`} role="status">{msg.text}</p>}
      {confirm ? (
        <div className="notice gold stack" style={{ gap: 10 }}>
          <span>Se enviará a <strong>{dest}</strong>. No se puede deshacer.</span>
          <span className="cluster">
            <button className="btn" disabled={pending} onClick={send}>Sí, enviar</button>
            <button className="btn quiet" onClick={() => setConfirm(false)}>Cancelar</button>
          </span>
        </div>
      ) : (
        <div><button className="btn" disabled={pending || !title.trim() || !body.trim()} onClick={() => setConfirm(true)}>Revisar y enviar</button></div>
      )}
    </div>
  );
}
