import Link from "next/link";
import Icon from "@/components/Icon";
import type { MarBravoRow } from "../kpis/MarBravoKpis";

const nf = new Intl.NumberFormat("es-CL");
const day = (unix: number) => (unix ? new Date(unix * 1000).toLocaleDateString("es-CL", { timeZone: "America/Santiago", day: "numeric", month: "short" }) : "nunca");

/** La lista de jugadores de Mar Bravo (acción "buscar"): no hay nombres guardados, se busca por el inicio del código de jugador. */
export default function MarBravoPlayers({ base, rows }: { base: string; rows: MarBravoRow[] }) {
  return (
    <div className="panel rows">
      {rows.map((p) => (
        <Link key={p.id} href={`${base}/${p.id}`} className="row">
          <div className="main">
            <div className="title"><span className="mono">{p.id}</span></div>
            <div className="sub">visto {day(p.last)} · {nf.format(p.doblones)} doblones · lona {p.lona} · pólvora {p.polvora} · hierro {p.hierro}</div>
          </div>
          <div className="aside">
            <div>Ronda {p.bestRound}</div>
            <div className="faint">{nf.format(p.runs)} corridas · {p.completed} completas</div>
          </div>
          <Icon name="chevron" className="chev" />
        </Link>
      ))}
    </div>
  );
}
