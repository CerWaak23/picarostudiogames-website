/**
 * El cambio de estilo, pintado por detrás.
 *
 * Un frente diagonal avanza desde la esquina de abajo a la derecha hacia la
 * esquina del logo. Por delante del frente van puntos que vuelan y se CLAVAN en
 * la retícula definitiva; detrás queda la retícula ya armada. Es una obra en
 * construcción: lo que ya se construyó no se vuelve a mover.
 *
 * Dos cosas que importan:
 *
 * 1. El canvas va DETRÁS del contenido (ver `.skin-wave` en globals.css). Nunca
 *    tapa el logo, los textos ni las imágenes: lo que se rehace es el fondo.
 *
 * 2. Los puntos aterrizan exactamente en la retícula de `.halftone-strong`
 *    (6px) y con su mismo color, así que cuando el canvas se va al final no
 *    aparece «otra imagen»: debajo ya está lo mismo, en el mismo lugar.
 *
 * Para que 28.000 puntos no se dibujen cuadro a cuadro, los que ya aterrizaron
 * se pintan UNA vez en un canvas aparte y cada cuadro solo se copia esa capa y
 * se dibujan los que van en el aire.
 */

export type SkinPaint = {
  /** Fondo del estilo nuevo. */
  ink: string;
  /** Color de los puntos en reposo (el `--dot` del estilo nuevo). */
  dot: string;
  /** Opacidad de los puntos en reposo (el `--dot-alpha-strong`). */
  dotAlpha: number;
  /** Color de los puntos mientras vuelan. */
  accent: string;
};

const DUR = 2000;
/** Cuándo el frente ya cruzó lo suficiente como para cambiar el estilo. */
const APPLY_AT = 0.62;
/** Igual que el `background-size` de .halftone-strong. */
const GRID = 6;
/** Qué parte del recorrido dura el vuelo de cada punto. */
const FLIGHT = 0.26;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

function channels(hex: string) {
  const h = hex.replace("#", "");
  return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
}

export function paintSkin(
  canvas: HTMLCanvasElement,
  colors: SkinPaint,
  /** Se llama cuando el frente ya cruzó: ahí se cambian las variables. */
  onApply: () => void,
  onDone: () => void
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    onApply();
    onDone();
    return () => {};
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const cssW = window.innerWidth;
  const cssH = window.innerHeight;
  const W = Math.round(cssW * dpr);
  const H = Math.round(cssH * dpr);
  canvas.width = W;
  canvas.height = H;
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;

  /* La capa de lo ya construido: se dibuja una vez por punto y no se toca más. */
  const settled = document.createElement("canvas");
  settled.width = W;
  settled.height = H;
  const sctx = settled.getContext("2d");
  if (!sctx) {
    onApply();
    onDone();
    return () => {};
  }

  const ink = channels(colors.ink);
  const dot = channels(colors.dot);
  const accent = channels(colors.accent);

  const step = GRID * dpr;
  const r = 1.35 * dpr;
  const cols = Math.ceil(W / step) + 1;
  const rows = Math.ceil(H / step) + 1;

  /* La trama del héroe se abre en diagonal (.halftone-sweep). Acá se repite esa
     caída para que lo construido calce con lo que hay debajo. */
  const falloff = (x: number, y: number) => {
    const d = Math.hypot((x / W + 0.02) / 0.95, (y / H + 0.08) / 1.05);
    return 1 - clamp01((d - 0.15) / 1.1) * 0.85;
  };

  /* Orden de construcción: por diagonal, de abajo-derecha a arriba-izquierda. */
  const uOf = (x: number, y: number) => (x / W + y / H) / 2;

  let raf = 0;
  let applied = false;
  /** Índice del siguiente punto que falta clavar, recorriendo por diagonales. */
  const pending: { x: number; y: number; u: number; ox: number; oy: number; a: number }[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = i * step + step * 0.5;
      const y = j * step + step * 0.5;
      const a = colors.dotAlpha * falloff(x, y);
      if (a < 0.004) continue;
      const dist = (55 + Math.random() * 120) * dpr;
      pending.push({
        x,
        y,
        u: uOf(x, y),
        /* Llegan volando desde abajo a la derecha, con algo de dispersión. */
        ox: dist * (0.8 + Math.random() * 0.45),
        oy: dist * (0.55 + Math.random() * 0.45),
        a,
      });
    }
  }
  /* De la diagonal más lejana a la más cercana a la esquina. */
  pending.sort((p, q) => q.u - p.u);

  let nextIdx = 0;
  const flying: typeof pending = [];
  const t0 = performance.now();

  const frame = (now: number) => {
    const t = clamp01((now - t0) / DUR);
    /* El frente, en coordenada diagonal: 1 = abajo-derecha, 0 = la esquina. */
    const front = 1 - easeOut(clamp01(t / APPLY_AT)) * 1.08;

    /* Despegan los que el frente acaba de alcanzar. */
    while (nextIdx < pending.length && pending[nextIdx].u >= front) {
      const p = pending[nextIdx++];
      (p as typeof p & { t0: number }).t0 = t;
      flying.push(p);
    }

    ctx.clearRect(0, 0, W, H);

    /* El fondo nuevo, pintado detrás del frente. Opaco todo el rato: al final
       el canvas tiene exactamente lo mismo que hay debajo, así que se limpia
       de una sin que se note. */
    const g = ctx.createLinearGradient(W, H, 0, 0);
    const p01 = clamp01(1 - front);
    g.addColorStop(0, `rgba(${ink},1)`);
    g.addColorStop(clamp01(p01 - 0.1), `rgba(${ink},1)`);
    g.addColorStop(clamp01(p01), `rgba(${ink},0)`);
    g.addColorStop(1, `rgba(${ink},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    /* Lo ya construido, de una sola copia. */
    ctx.drawImage(settled, 0, 0);

    /* Lo que va en el aire. Al llegar a 1 se clava en la capa de abajo y no se
       vuelve a dibujar nunca más: por eso no hay salto al final. */
    for (let k = flying.length - 1; k >= 0; k--) {
      const p = flying[k] as (typeof pending)[number] & { t0: number };
      const local = clamp01((t - p.t0) / FLIGHT);
      if (local >= 1) {
        sctx.fillStyle = `rgba(${dot},${p.a})`;
        sctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
        flying.splice(k, 1);
        continue;
      }
      const e = easeOut(local);
      /* Mientras vuela va en el color de acento y se apaga al aterrizar. */
      const glow = 1 - local;
      ctx.fillStyle = `rgba(${accent},${(p.a + 0.5 * glow) * (0.35 + 0.65 * local)})`;
      const rr = r * (1 + glow * 1.6);
      ctx.fillRect(p.x + p.ox * (1 - e) - rr, p.y + p.oy * (1 - e) - rr, rr * 2, rr * 2);
    }

    if (!applied && t >= APPLY_AT) {
      applied = true;
      onApply();
    }

    if (t < 1) {
      raf = requestAnimationFrame(frame);
    } else {
      /* Entrega: debajo ya está el mismo fondo y la misma trama, en el mismo
         sitio, así que el canvas se puede ir sin que se note. */
      ctx.clearRect(0, 0, W, H);
      onDone();
    }
  };

  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    if (!applied) onApply();
    ctx.clearRect(0, 0, W, H);
    onDone();
  };
}
