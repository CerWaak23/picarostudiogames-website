"use client";

import { useState, useTransition } from "react";
import { adminPlayer, banPlayer, giftPlayer, hidePlayer, resetPlayer, restorePlayer, type ActionResult } from "./actions";

type Props = { projectId: string; target: string; banned: boolean; hidden: boolean; isAdmin: boolean; baseAdmin: boolean };

export default function PlayerActions({ projectId, target, banned, hidden, isAdmin, baseAdmin }: Props) {
  const [pending, start] = useTransition();
  const [confirm, setConfirm] = useState<string | null>(null);
  const [msg, setMsg] = useState<ActionResult | null>(null);
  const [crystals, setCrystals] = useState("0");
  const [gold, setGold] = useState("0");
  const [pass, setPass] = useState("0");
  const [why, setWhy] = useState("");
  const [typed, setTyped] = useState("");

  const exec = (f: () => Promise<ActionResult>) =>
    start(async () => {
      setMsg(await f());
      setConfirm(null);
    });

  // Un botón que pide un segundo clic antes de ejecutar.
  const Two = ({ id, label, sure, run, danger }: { id: string; label: string; sure: string; run: () => Promise<ActionResult>; danger?: boolean }) =>
    confirm === id ? (
      <span className="cluster">
        <button className="btn danger sm" disabled={pending} onClick={() => exec(run)}>{sure}</button>
        <button className="btn quiet sm" onClick={() => setConfirm(null)}>Cancelar</button>
      </span>
    ) : (
      <button className={`btn quiet sm${danger ? " danger-text" : ""}`} disabled={pending} onClick={() => setConfirm(id)}>{label}</button>
    );

  const giftSummary = [Number(crystals) && `${crystals} cristales`, Number(gold) && `${gold} oro`, Number(pass) && `${pass} días de pase`].filter(Boolean).join(", ");

  return (
    <section className="section">
      <div className="section-title">
        <h2>Acciones</h2>
        <span>Todo queda en la auditoría con tu correo</span>
      </div>

      {msg && <p className={`notice ${msg.ok ? "ok" : "err"}`} style={{ marginBottom: 12 }} role="status">{msg.message}</p>}

      <div className="panel rows">
        <div className="row" style={{ alignItems: "flex-start", flexDirection: "column", gap: 10 }}>
          <div className="title">Moderación</div>
          <label className="field" style={{ width: "100%" }}>
            Motivo (lo ve el jugador, máx. 60)
            <input className="input" value={why} maxLength={60} onChange={(e) => setWhy(e.target.value)} placeholder="Opcional" />
          </label>
          <div className="cluster">
            <Two id="ban" danger={!banned} label={banned ? "Desbanear" : "Banear"} sure={banned ? "Sí, desbanear" : "Sí, banear"} run={() => banPlayer(projectId, target, banned, why)} />
            <Two id="hide" label={hidden ? "Devolver al ranking" : "Quitar del ranking esta semana"} sure="Confirmar" run={() => hidePlayer(projectId, target, hidden)} />
            {!baseAdmin && (
              <Two id="admin" label={isAdmin ? "Quitar administrador" : "Hacer administrador"} sure="Confirmar" run={() => adminPlayer(projectId, target, !isAdmin)} />
            )}
          </div>
        </div>

        <div className="row" style={{ alignItems: "flex-start", flexDirection: "column", gap: 10 }}>
          <div>
            <div className="title">Regalar o quitar</div>
            <div className="sub">Un número negativo quita. Le llega la próxima vez que abra el juego.</div>
          </div>
          <div className="grid-3" style={{ width: "100%" }}>
            <label className="field">Cristales<input className="input" type="number" inputMode="numeric" value={crystals} onChange={(e) => setCrystals(e.target.value)} /></label>
            <label className="field">Oro<input className="input" type="number" inputMode="numeric" value={gold} onChange={(e) => setGold(e.target.value)} /></label>
            <label className="field">Días de pase<input className="input" type="number" inputMode="numeric" value={pass} onChange={(e) => setPass(e.target.value)} /></label>
          </div>
          <Two id="gift" label="Enviar" sure={`Confirmar: ${giftSummary || "nada"}`}
               run={() => giftPlayer(projectId, target, Number(crystals), Number(gold), Number(pass), why)} />
        </div>

        <details className="fold">
          <summary style={{ color: "var(--danger)" }}>Zona peligrosa</summary>
          <div className="fold-body stack">
            <p className="muted">
              Reiniciar borra todo lo del jugador en el servidor y su teléfono parte de cero. Escribe <strong>REINICIAR</strong> para habilitarlo.
              Si te arrepientes, puedes recuperarlo durante 24 horas.
            </p>
            <div className="cluster">
              <input className="input" style={{ width: "11rem" }} value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="REINICIAR" aria-label="Escribe REINICIAR para confirmar" />
              <button className="btn danger" disabled={pending || typed.trim() !== "REINICIAR"} onClick={() => exec(() => resetPlayer(projectId, target, typed, why))}>Reiniciar cuenta</button>
              <Two id="restore" label="Recuperar (24 h)" sure="Confirmar recuperar" run={() => restorePlayer(projectId, target)} />
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
