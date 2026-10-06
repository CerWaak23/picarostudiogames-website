"use client";

import { useState, useTransition } from "react";
import { sendMessage } from "./actions";

type Player = { id: string; name: string };

const box: React.CSSProperties = { padding: 10, borderRadius: 8, border: "1px solid var(--surface-2)", background: "var(--bg)", color: "var(--text)", fontSize: "1rem", width: "100%" };
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

  const dest = to ? players.find((p) => p.id === to)?.name || to : "TODOS los jugadores";

  const send = () =>
    start(async () => {
      const r = await sendMessage(projectId, to, title, body, kind, options.split("\n"));
      setMsg({ ok: r.ok, text: r.ok ? "Mensaje enviado" : r.message });
      setConfirm(false);
      if (r.ok) { setTitle(""); setBody(""); setOptions(""); }
    });

  return (
    <div className="card" style={{ display: "grid", gap: 12 }}>
      <label>Para
        <select style={box} value={to} onChange={(e) => { setTo(e.target.value); setConfirm(false); }}>
          <option value="">Todos los jugadores</option>
          {players.map((p) => <option key={p.id} value={p.id}>{p.name || "Sin nombre"} · {p.id.slice(0, 6)}</option>)}
        </select>
      </label>
      <label>Título (máx. 60)<input style={box} value={title} maxLength={60} onChange={(e) => setTitle(e.target.value)} /></label>
      <label>Texto (máx. 500)<textarea style={{ ...box, minHeight: 100 }} value={body} maxLength={500} onChange={(e) => setBody(e.target.value)} /></label>
      <label>Cómo pueden responder
        <select style={box} value={kind} onChange={(e) => setKind(e.target.value)}>
          {KINDS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </label>
      {(kind === "one" || kind === "many") && (
        <label>Opciones (una por línea, de 2 a 6)
          <textarea style={{ ...box, minHeight: 80 }} value={options} onChange={(e) => setOptions(e.target.value)} />
        </label>
      )}
      {msg && <div className={msg.ok ? "" : "err"} style={msg.ok ? { color: "var(--gold)" } : undefined}>{msg.text}</div>}
      {confirm ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span>Se enviará a {dest}.</span>
          <button className="btn" disabled={pending} onClick={send}>Sí, enviar</button>
          <button className="btn ghost" onClick={() => setConfirm(false)}>Cancelar</button>
        </div>
      ) : (
        <div><button className="btn" disabled={pending || !title.trim() || !body.trim()} onClick={() => setConfirm(true)}>Enviar…</button></div>
      )}
    </div>
  );
}
