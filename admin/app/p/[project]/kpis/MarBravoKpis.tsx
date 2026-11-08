import Link from "next/link";

/** Métricas de Mar Bravo: lo que devuelve la acción "resumen" de Mar Bravo/Cloud/scripts/Jugadores.js. */
export type MarBravoSummary = {
  players: number; activeToday: number; active7: number; new7: number;
  runs: number; completed: number; sunk: number; abandoned: number; rounds: number;
  hours: number; minPerRun: number; avgBestRound: number;
  doblones: number; perlas: number; lona: number; polvora: number; hierro: number;
  topBestRound?: MarBravoRow[]; topRuns?: MarBravoRow[];
};
export type MarBravoRow = {
  id: string; last: number; runs: number; completed: number; sunk: number; bestRound: number;
  doblones: number; perlas: number; lona: number; polvora: number; hierro: number;
};

const nf = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 1 });
const pct = (part: number, total: number) => (total > 0 ? ` · ${Math.round((part / total) * 100)}%` : "");

function Group({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <div className="section-title"><h2>{title}</h2></div>
      <dl className="panel pad kv" style={{ margin: 0 }}>
        {items.map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>
    </div>
  );
}

function Top({ title, rows, base, aside }: { title: string; rows?: MarBravoRow[]; base: string; aside: (r: MarBravoRow) => string }) {
  if (!rows?.length) return null;
  return (
    <div>
      <div className="section-title"><h2>{title}</h2></div>
      <div className="panel rows">
        {rows.slice(0, 5).map((r, i) => (
          <Link key={r.id} href={`${base}/${r.id}`} className="row">
            <div className="main"><div className="title">{i + 1}. <span className="mono">{r.id.slice(0, 10)}</span></div></div>
            <div className="aside">{aside(r)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function MarBravoKpis({ base, s }: { base: string; s: MarBravoSummary }) {
  const n = (v: number) => nf.format(v ?? 0);
  return (
    <div className="stack" style={{ gap: 28 }}>
      <div className="grid-2" style={{ alignItems: "start" }}>
        <Group title="Actividad" items={[["Jugadores", n(s.players)], ["Activos hoy", n(s.activeToday)], ["Activos en 7 días", n(s.active7)], ["Nuevos en 7 días", n(s.new7)]]} />
        <Group title="Tiempo de juego" items={[["Horas jugadas", n(s.hours)], ["Minutos por corrida", n(s.minPerRun)], ["Mejor ronda promedio", n(s.avgBestRound)]]} />
      </div>
      <div className="grid-2" style={{ alignItems: "start" }}>
        <Group title="Corridas" items={[
          ["Corridas", n(s.runs)],
          ["Ruta completa", n(s.completed) + pct(s.completed, s.runs)],
          ["Hundidas", n(s.sunk) + pct(s.sunk, s.runs)],
          ["Abandonadas", n(s.abandoned) + pct(s.abandoned, s.runs)],
          ["Rondas despejadas", n(s.rounds)],
        ]} />
        <Group title="Economía guardada" items={[["Doblones", n(s.doblones)], ["Perlas", n(s.perlas)], ["Lona", n(s.lona)], ["Pólvora", n(s.polvora)], ["Hierro", n(s.hierro)]]} />
      </div>
      <div className="grid-2" style={{ alignItems: "start" }}>
        <Top title="Mejor ronda" rows={s.topBestRound} base={base} aside={(r) => `ronda ${r.bestRound}`} />
        <Top title="Más corridas" rows={s.topRuns} base={base} aside={(r) => `${nf.format(r.runs)} corridas`} />
      </div>
    </div>
  );
}
