"use client";

import { useState, useTransition } from "react";
import { adminPlayer, banPlayer, giftPlayer, hidePlayer, resetPlayer, restorePlayer, type ActionResult } from "./actions";

type Props = { projectId: string; target: string; banned: boolean; hidden: boolean; isAdmin: boolean; baseAdmin: boolean };

const box: React.CSSProperties = { padding: 10, borderRadius: 8, border: "1px solid var(--surface-2)", background: "var(--bg)", color: "var(--text)", fontSize: "1rem", width: "100%" };

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
      <span style={{ display: "inline-flex", gap: 6 }}>
        <button className="btn" style={{ background: "var(--danger)", color: "#fff" }} disabled={pending} onClick={() => exec(run)}>{sure}</button>
        <button className="btn ghost" onClick={() => setConfirm(null)}>Cancelar</button>
      </span>
    ) : (
      <button className="btn ghost" style={danger ? { color: "var(--danger)" } : undefined} disabled={pending} onClick={() => setConfirm(id)}>{label}</button>
    );

  return (
    <section style={{ marginTop: 28 }}>
      <h2 style={{ fontSize: "1.1rem" }}>Acciones</h2>
      <p className="muted">Cada acción queda registrada en la auditoría con tu correo.</p>
      {msg && <p className={msg.ok ? "" : "err"} style={msg.ok ? { color: "var(--gold)" } : undefined}>{msg.message}</p>}

      <div className="card" style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Two id="ban" danger={!banned} label={banned ? "Desbanear" : "Banear"} sure={banned ? "Sí, desbanear" : "Sí, banear"}
               run={() => banPlayer(projectId, target, banned, why)} />
          <Two id="hide" label={hidden ? "Devolver al ranking" : "Quitar del ranking esta semana"} sure="Confirmar"
               run={() => hidePlayer(projectId, target, hidden)} />
          {!baseAdmin && (
            <Two id="admin" label={isAdmin ? "Quitar administrador" : "Hacer administrador"} sure="Confirmar"
                 run={() => adminPlayer(projectId, target, !isAdmin)} />
          )}
        </div>

        <div>
          <div className="muted" style={{ marginBottom: 6 }}>Motivo / nota (se le muestra al jugador, máx. 60)</div>
          <input style={box} value={why} maxLength={60} onChange={(e) => setWhy(e.target.value)} placeholder="Opcional" />
        </div>

        <div>
          <div className="muted" style={{ marginBottom: 6 }}>Regalar o quitar (número negativo = quitar)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            <label>Cristales<input style={box} type="number" value={crystals} onChange={(e) => setCrystals(e.target.value)} /></label>
            <label>Oro<input style={box} type="number" value={gold} onChange={(e) => setGold(e.target.value)} /></label>
            <label>Días de pase<input style={box} type="number" value={pass} onChange={(e) => setPass(e.target.value)} /></label>
          </div>
          <div style={{ marginTop: 8 }}>
            <Two id="gift" label="Enviar" sure={`Confirmar: ${crystals} cristales, ${gold} oro, ${pass} días`}
                 run={() => giftPlayer(projectId, target, Number(crystals), Number(gold), Number(pass), why)} />
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--surface-2)", paddingTop: 14 }}>
          <div className="err" style={{ marginBottom: 6 }}>Zona peligrosa</div>
          <div className="muted" style={{ marginBottom: 6 }}>
            Reiniciar borra todo lo del jugador en el servidor y su teléfono parte de cero. Escribe REINICIAR para habilitarlo.
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input style={{ ...box, width: 180 }} value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="REINICIAR" />
            <button className="btn" style={{ background: "var(--danger)", color: "#fff" }} disabled={pending || typed.trim() !== "REINICIAR"}
                    onClick={() => exec(() => resetPlayer(projectId, target, typed, why))}>Reiniciar cuenta</button>
            <Two id="restore" label="Recuperar (24 h)" sure="Confirmar recuperar" run={() => restorePlayer(projectId, target)} />
          </div>
        </div>
      </div>
    </section>
  );
}
