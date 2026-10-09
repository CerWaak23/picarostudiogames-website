"use client";

import { useState, useTransition } from "react";
import { createCode, pauseCode } from "./actions";

// Largo de un código: igual que Codigos.js (MIN_CODE/MAX_CODE) y RedeemRules del juego.
const MIN_CODE = 4;
const MAX_CODE = 16;
const cleanCode = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, MAX_CODE);

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
  const codeTooShort = code.length > 0 && code.length < MIN_CODE;
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
    <div className="stack">
      <label className="field">Código ({MIN_CODE} a {MAX_CODE} letras o números; vacío = al azar)
        <input className="input" value={code} maxLength={MAX_CODE} onChange={(e) => setCode(cleanCode(e.target.value))} placeholder="Ej. SANTI500" autoCapitalize="characters" />
        <span className="muted" style={codeTooShort ? { color: "var(--danger)" } : undefined}>
          {code.length}/{MAX_CODE}{codeTooShort ? ` · mínimo ${MIN_CODE}` : ""} · sin espacios ni guiones
        </span>
      </label>
      <div className="grid-3">
        <label className="field">Cristales<input className="input" type="number" inputMode="numeric" min={0} value={crystals} onChange={(e) => setCrystals(e.target.value)} /></label>
        <label className="field">Oro<input className="input" type="number" inputMode="numeric" min={0} value={gold} onChange={(e) => setGold(e.target.value)} /></label>
        <label className="field">Días de pase<input className="input" type="number" inputMode="numeric" min={0} value={pass} onChange={(e) => setPass(e.target.value)} /></label>
      </div>
      <div className="grid-2">
        <label className="field">Usos máximos (0 = sin límite)<input className="input" type="number" inputMode="numeric" min={0} value={maxUses} onChange={(e) => setMaxUses(e.target.value)} /></label>
        <label className="field">Vence en días (0 = nunca)<input className="input" type="number" inputMode="numeric" min={0} value={days} onChange={(e) => setDays(e.target.value)} /></label>
      </div>
      <label className="field">Nota interna (a quién va)
        <input className="input" value={note} maxLength={40} onChange={(e) => setNote(e.target.value)} placeholder="Máx. 40 caracteres" />
      </label>
      {msg && <p className={`notice ${msg.ok ? "ok" : "err"}`} role="status">{msg.text}</p>}
      {confirm ? (
        <div className="notice gold stack" style={{ gap: 10 }}>
          <span>Se creará <strong>{code || "un código al azar"}</strong>: {reward || "nada"}, {uses}, {expiry}.</span>
          <span className="cluster">
            <button className="btn" disabled={pending} onClick={create}>Sí, crear</button>
            <button className="btn quiet" onClick={() => setConfirm(false)}>Cancelar</button>
          </span>
        </div>
      ) : (
        <div><button className="btn" disabled={pending || !reward || codeTooShort} onClick={() => setConfirm(true)}>Revisar y crear</button></div>
      )}
    </div>
  );
}

export function PauseButton({ projectId, code, paused }: { projectId: string; code: string; paused: boolean }) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");
  return (
    <div className="cluster">
      <button className="btn quiet sm" disabled={pending}
              onClick={() => start(async () => { const r = await pauseCode(projectId, code, !paused); setErr(r.ok ? "" : r.message); })}>
        {paused ? "Reanudar" : "Pausar"}
      </button>
      {err && <span className="notice err" role="status">{err}</span>}
    </div>
  );
}
