"use client";

import { useState, useTransition } from "react";
import { createCode, pauseCode } from "./actions";

const box: React.CSSProperties = { padding: 10, borderRadius: 8, border: "1px solid var(--surface-2)", background: "var(--bg)", color: "var(--text)", fontSize: "1rem", width: "100%" };

export function CodeForm({ projectId }: { projectId: string }) {
  const [pending, start] = useTransition();
  const [code, setCode] = useState("");
  const [crystals, setCrystals] = useState("0");
  const [gold, setGold] = useState("0");
  const [pass, setPass] = useState("0");
  const [maxUses, setMaxUses] = useState("0");
  const [days, setDays] = useState("30");
  const [note, setNote] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const n = (s: string) => Number(s) || 0;
  const reward = [n(crystals) && `${n(crystals)} cristales`, n(gold) && `${n(gold)} oro`, n(pass) && `${n(pass)} días de pase`].filter(Boolean).join(" + ");
  const uses = n(maxUses) > 0 ? `${n(maxUses)} usos` : "usos ilimitados (uno por jugador)";
  const expiry = n(days) > 0 ? `vence en ${n(days)} días` : "no vence";

  const create = () =>
    start(async () => {
      const r = await createCode(projectId, code, n(crystals), n(gold), n(pass), n(maxUses), n(days), note);
      const made = r.data?.codes?.[0]?.code;
      setMsg({ ok: r.ok, text: r.ok ? `Código creado: ${made ?? code}` : r.message });
      setConfirm(false);
      if (r.ok) setCode("");
    });

  return (
    <div className="card" style={{ display: "grid", gap: 12 }}>
      <label>Código (4 a 16 letras o números; vacío = al azar)
        <input style={box} value={code} maxLength={16} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Ej. SANTI500" />
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        <label>Cristales<input style={box} type="number" min={0} value={crystals} onChange={(e) => setCrystals(e.target.value)} /></label>
        <label>Oro<input style={box} type="number" min={0} value={gold} onChange={(e) => setGold(e.target.value)} /></label>
        <label>Días de pase<input style={box} type="number" min={0} value={pass} onChange={(e) => setPass(e.target.value)} /></label>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <label>Usos máximos (0 = sin límite)<input style={box} type="number" min={0} value={maxUses} onChange={(e) => setMaxUses(e.target.value)} /></label>
        <label>Vence en días (0 = nunca)<input style={box} type="number" min={0} value={days} onChange={(e) => setDays(e.target.value)} /></label>
      </div>
      <label>Nota interna (a quién va, máx. 40)<input style={box} value={note} maxLength={40} onChange={(e) => setNote(e.target.value)} /></label>
      {msg && <div className={msg.ok ? "" : "err"} style={msg.ok ? { color: "var(--gold)" } : undefined}>{msg.text}</div>}
      {confirm ? (
        <div style={{ display: "grid", gap: 8 }}>
          <div>Se creará <strong>{code || "un código al azar"}</strong>: {reward || "nada"} · {uses} · {expiry}.</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" disabled={pending} onClick={create}>Sí, crear</button>
            <button className="btn ghost" onClick={() => setConfirm(false)}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div><button className="btn" disabled={pending || !reward} onClick={() => setConfirm(true)}>Crear…</button></div>
      )}
    </div>
  );
}

export function PauseButton({ projectId, code, paused }: { projectId: string; code: string; paused: boolean }) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");
  return (
    <>
      <button className="btn ghost" disabled={pending}
              onClick={() => start(async () => { const r = await pauseCode(projectId, code, !paused); setErr(r.ok ? "" : r.message); })}>
        {paused ? "Reanudar" : "Pausar"}
      </button>
      {err && <span className="err"> {err}</span>}
    </>
  );
}
