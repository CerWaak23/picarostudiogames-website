import Link from "next/link";

/** Métricas de Mar Bravo: lo que devuelve la acción "resumen" de Mar Bravo/Cloud/scripts/Jugadores.js. */
export type MarBravoSummary = {
  players: number; activeToday: number; active7: number; new7: number;
  runs: number; completed: number; sunk: number; abandoned: number; rounds: number;
  hours: number; minPerRun: number; avgBestRound: number;
  doblones: number; perlas: number; lona: number; polvora: number; hierro: number;
  topBestRound?: MarBravoRow[]; topRuns?: MarBravoRow[];
  // (2026-11-08) Desde la versión del juego que manda los contadores: lo de antes no se cuenta.
  ads?: number; adPlayers?: number; buys?: number; buyers?: number;
  pieces?: { id: string; players: number; equipped: number; avgLevel: number; maxLevel: number }[];
  cards?: { id: string; offered: number; picked: number; pickRate: number }[];
  purchases?: { id: string; times: number; players: number }[];
  adPlaces?: { id: string; views: number; players: number }[];
};

/** Los nombres que ve el jugador (Mar Bravo/Assets/Scripts/Sim/PiezasDelBarco.cs y Cartas.cs). Lo que no esté acá sale con su id. */
const PIEZAS: Record<string, string> = {
  "canones-base": "Cañones de siempre", carronadas: "Carronadas", bronce: "Bronce", largos: "Cañones largos",
  "vela-base": "Vela de siempre", latina: "Vela latina", "gran-cuadra": "Gran cuadra", seda: "Vela de seda",
  "casco-base": "Casco de siempre", roble: "Casco de roble", "casco-balandra": "Casco de balandra", "casco-carraca": "Casco de carraca",
  alerce: "Casco de alerce", "dos-cubiertas": "Casco de bergantín",
};
const CARTAS: Record<string, string> = {
  "bala-de-fuego": "Bala de fuego", palanqueta: "Palanqueta", barriles: "Barriles", "bandera-falsa": "Bandera falsa",
  "toma-de-valdivia": "Toma de Valdivia", metralla: "Metralla", rebotadora: "Bala rebotadora", "barrer-la-popa": "Barrer la popa",
  mortero: "Mortero", fumarolas: "Las fumarolas", arpon: "Arpón",
};
const ANUNCIOS: Record<string, string> = { duplicar: "Duplicar el botín al terminar" };

/** "skin.bote-fantasmal~Vela" → "Skin: bote-fantasmal (Vela)", "plano.LAPICÁ" → "Plano: LAPICÁ"… */
function compra(id: string): string {
  if (id === "pack-de-apoyo") return "Pack de apoyo";
  const [tipo, ...resto] = id.split(".");
  const cosa = resto.join(".").replace("~", " · ");
  const nombre: Record<string, string> = { skin: "Skin (pieza)", set: "Skin (set)", plano: "Plano", edificio: "Edificio", carta: "Carta (Maestranza)", tope: "Nivel de carta" };
  return `${nombre[tipo] ?? tipo}: ${CARTAS[cosa] ?? cosa}`;
}
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

function List({ title, head, rows, empty }: { title: string; head: [string, string][]; rows: [string, string][]; empty: string }) {
  return (
    <div>
      <div className="section-title"><h2>{title}</h2></div>
      <dl className="panel pad kv" style={{ margin: 0 }}>
        {head.map(([k, v]) => (<div key={k}><dt><strong>{k}</strong></dt><dd><strong>{v}</strong></dd></div>))}
        {rows.length === 0 ? <div><dt className="faint">{empty}</dt><dd /></div> : rows.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
      </dl>
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

      <p className="faint" style={{ fontSize: "0.82rem", margin: 0 }}>
        Lo que sigue se cuenta desde la versión del juego del 8 de noviembre de 2026: lo jugado antes no está.
      </p>
      <div className="grid-2" style={{ alignItems: "start" }}>
        <List title="Anuncios" head={[["Vistos", n(s.ads ?? 0)], ["Jugadores que vieron", n(s.adPlayers ?? 0)]]}
              rows={(s.adPlaces ?? []).map((a) => [ANUNCIOS[a.id] ?? a.id, `${n(a.views)} · ${n(a.players)} jug.`])}
              empty="Nadie ha visto un anuncio todavía." />
        <List title="Tienda" head={[["Compras", n(s.buys ?? 0)], ["Jugadores que compraron", n(s.buyers ?? 0)]]}
              rows={(s.purchases ?? []).map((c) => [compra(c.id), `${n(c.times)} · ${n(c.players)} jug.`])}
              empty="Nadie ha comprado todavía." />
      </div>
      <div className="grid-2" style={{ alignItems: "start" }}>
        <List title="Mejoras del astillero" head={[]}
              rows={(s.pieces ?? []).map((p) => [PIEZAS[p.id] ?? p.id, `nivel ${n(p.avgLevel)} (máx ${p.maxLevel}) · ${n(p.players)} la tienen · ${n(p.equipped)} puesta`])}
              empty="Sin datos del astillero." />
        <List title="Cartas: cuántas veces salen y cuántas se eligen" head={[]}
              rows={(s.cards ?? []).map((c) => [CARTAS[c.id] ?? c.id, `${n(c.picked)} de ${n(c.offered)} · ${c.pickRate}%`])}
              empty="Todavía no salen cartas." />
      </div>
    </div>
  );
}
