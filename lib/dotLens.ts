/**
 * La trama, viva: se dobla donde pasa el mouse y hace una onda donde se hace
 * clic, como una gota que cae.
 *
 * Mientras la lente está encendida, la trama de CSS de esa sección se apaga
 * (`background-image: none`) y la dibuja este canvas, que va DENTRO del div de
 * la trama. Vivir adentro es lo que hace que todo esto salga barato y exacto:
 *
 *   · hereda la máscara del div, así que la caída diagonal del héroe
 *     (`.halftone-sweep`) se le aplica sola, sin repetir ese degradado en JS;
 *   · no hay que recortarle un agujero a la trama de CSS en cada cuadro. Esa
 *     fue la primera versión y costaba 25 ms por cuadro: repintar la máscara de
 *     una capa de 856x658 es carísimo, y con una onda de 500 px habría sido peor.
 *
 * Lo quieto se dibuja UNA vez en un canvas aparte (`estatica`). Cada cuadro solo
 * se repone desde ahí lo que se tocó, se borran los puntos que se mueven y se
 * vuelven a dibujar corridos. Con el cursor quieto y sin ondas no corre ni un
 * cuadro.
 */

/** Hasta dónde se siente el peso del puntero, en pixeles de CSS. */
const ALCANCE = 190;
/** Cuánto se corre un punto que cae justo encima del puntero (0 a 1). */
const FUERZA = 0.85;
/** El paso de la retícula: el mismo `background-size` de `.halftone-strong`. */
const PASO = 6;
/** El radio del punto: el mismo de `.halftone-strong`. */
const RADIO = 1.35;

/** Cuánto dura la onda de un clic. */
const ONDA_DUR = 900;
/** Hasta dónde llega el frente de la onda, en pixeles de CSS. Lo que cuesta un
 *  cuadro crece con esto: es la superficie de trama que hay que reponer y volver
 *  a dibujar. A 420 son unos 6.000 puntos en el peor cuadro. */
const ONDA_LEJOS = 420;
/** Ancho del frente: el tramo de trama que la onda tiene agarrado a la vez. */
const ONDA_ANCHO = 34;
/** Cuánto se corre un punto en la cresta, al principio. */
const ONDA_ALTO = 11;
/** Más de esto no se acumulan: con clics rápidos las ondas se tapan entre ellas
 *  y solo cuestan. */
const ONDAS_MAX = 3;

/** Menos de esto no vale la pena borrar y volver a dibujar un punto. */
const MINIMO = 0.3;

type Onda = { x: number; y: number; t0: number };
type Rect = [number, number, number, number];

type Lente = {
  canvas: HTMLCanvasElement;
  /** El div de la trama: de él salen el color y la opacidad, y es el que se
   *  apaga mientras dibuja el canvas. */
  trama: HTMLElement;
  estatica: HTMLCanvasElement | null;
  sello: HTMLCanvasElement | null;
  w: number;
  h: number;
  dpr: number;
  /** Con qué piel se construyeron `estatica` y `sello`. */
  piel: string;
  alpha: number;
  lado: number;
  ondas: Onda[];
  /** Lo que se tocó el cuadro pasado y hay que reponer. */
  sucios: Rect[];
  activa: boolean;
  /** Buffer de posiciones finales, para no crear uno por cuadro. */
  destino: Float32Array;
};

const lentes = new Set<Lente>();
let punteroX = -1e6;
let punteroY = -1e6;
let pedido = 0;
let escuchando = false;

function disco(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** Rehace el sello y la trama quieta. Caro, pero solo al encender la lente, al
 *  cambiar de piel o al cambiar de tamaño la ventana. */
function construir(l: Lente, color: string) {
  const radio = RADIO * l.dpr;
  l.lado = Math.ceil(radio) + 1;

  const sello = document.createElement("canvas");
  sello.width = sello.height = l.lado * 2;
  const sctx = sello.getContext("2d");
  if (sctx) disco(sctx, l.lado, l.lado, radio, color);
  l.sello = sello;

  const estatica = document.createElement("canvas");
  estatica.width = l.w;
  estatica.height = l.h;
  const ectx = estatica.getContext("2d");
  if (ectx) {
    /* Punto por punto y no con un patrón repetido: el paso en pixeles del
       aparato (6 * dpr) no siempre es entero, y un patrón hay que redondearlo.
       Redondeado, la trama quieta y los puntos que se mueven quedarían en
       retículas distintas y al soltarse un punto se vería el salto. */
    ectx.globalAlpha = l.alpha;
    for (let y = PASO / 2; y < l.h / l.dpr; y += PASO) {
      for (let x = PASO / 2; x < l.w / l.dpr; x += PASO) {
        ectx.drawImage(sello, x * l.dpr - l.lado, y * l.dpr - l.lado);
      }
    }
  }
  l.estatica = estatica;
}

/** Repone desde la trama quieta todo lo que se tocó. */
function reponer(l: Lente, rects: Rect[]) {
  const ctx = l.canvas.getContext("2d");
  if (!ctx || !l.estatica) return;
  ctx.globalAlpha = 1;
  for (const [x, y, w, h] of rects) {
    const x0 = Math.max(0, Math.floor(x));
    const y0 = Math.max(0, Math.floor(y));
    const x1 = Math.min(l.w, Math.ceil(x + w));
    const y1 = Math.min(l.h, Math.ceil(y + h));
    if (x1 <= x0 || y1 <= y0) continue;
    ctx.clearRect(x0, y0, x1 - x0, y1 - y0);
    ctx.drawImage(l.estatica, x0, y0, x1 - x0, y1 - y0, x0, y0, x1 - x0, y1 - y0);
  }
}

/**
 * El anillo de una onda, en cuatro tiras. Reponer su cuadrado entero sería el
 * doble de superficie y el frente es angosto.
 *
 * El hueco que dejan las cuatro tiras no es el cuadrado que circunscribe al
 * círculo de adentro, es el que le CABE dentro (lado r0·√2). Con el otro, las
 * cuatro diagonales del anillo se quedaban afuera: un cuarto de los puntos que
 * se mueven no se reponía y quedaban pegados por donde pasó la onda.
 */
function anillo(cx: number, cy: number, r0: number, r1: number, dpr: number): Rect[] {
  const b = r1 * dpr;
  const k = (Math.max(0, r0) / Math.SQRT2) * dpr;
  const x = cx * dpr;
  const y = cy * dpr;
  const grosor = b - k;
  if (grosor <= 0) return [];
  return [
    [x - b, y - b, b * 2, grosor],
    [x - b, y + k, b * 2, grosor],
    [x - b, y - k, grosor, k * 2],
    [x + k, y - k, grosor, k * 2],
  ];
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function dibujar(ahora: number) {
  pedido = 0;
  /* Mientras se cambia de estilo manda lib/skinPaint.ts, que repinta la trama
     entera en su propio canvas y tiene su propio imán. */
  const pintando = document.documentElement.hasAttribute("data-painting") || document.hidden;
  let sigue = false;

  for (const l of lentes) {
    const ctx = l.canvas.getContext("2d");
    const caja = l.canvas.getBoundingClientRect();
    if (!ctx || caja.width < 2 || caja.height < 2) continue;

    const cx = punteroX - caja.left;
    const cy = punteroY - caja.top;
    const cerca =
      cx > -ALCANCE && cy > -ALCANCE && cx < caja.width + ALCANCE && cy < caja.height + ALCANCE;

    if (!pintando) l.ondas = l.ondas.filter((o) => ahora - o.t0 < ONDA_DUR);
    else l.ondas.length = 0;

    if (pintando || (!cerca && !l.ondas.length)) {
      if (l.activa) {
        ctx.clearRect(0, 0, l.canvas.width, l.canvas.height);
        l.trama.removeAttribute("data-lens");
        l.sucios.length = 0;
        l.activa = false;
      }
      continue;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.round(caja.width * dpr);
    const h = Math.round(caja.height * dpr);
    const piel = document.documentElement.dataset.skin || "";
    if (l.canvas.width !== w || l.canvas.height !== h || l.dpr !== dpr || piel !== l.piel) {
      l.canvas.width = w;
      l.canvas.height = h;
      l.w = w;
      l.h = h;
      l.dpr = dpr;
      l.piel = piel;
      const st = getComputedStyle(l.trama);
      l.alpha = parseFloat(st.getPropertyValue("--dot-alpha-strong")) || 0.07;
      const [r, g, b] = st.getPropertyValue("--dot").trim().split(/[\s,/]+/).map(Number);
      construir(l, `rgb(${r || 238},${g || 238},${b || 238})`);
      l.activa = false;
    }
    if (!l.activa) {
      /* La trama quieta, entera, de una copia. Esto va SIEMPRE que se encienda,
         no solo la primera vez: al apagarse el canvas se vacía, y el div tiene
         su trama apagada mientras la lente manda, así que volver a encender sin
         copiarla dejaría la sección sin un solo punto. */
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      if (l.estatica) ctx.drawImage(l.estatica, 0, 0);
      l.sucios.length = 0;
      /* Y recién acá se apaga la de CSS: el canvas ya tiene lo mismo dibujado,
         así que el relevo no se ve. */
      l.trama.setAttribute("data-lens", "");
      l.activa = true;
    }

    /* Lo que esta vez se va a mover, y lo del cuadro pasado, que hay que dejar
       como estaba. */
    const tocados: Rect[] = [];
    if (cerca) {
      /* Con la misma holgura que el anillo: un punto del imán se corre hacia
         adentro, pero si encima le pasa una onda por encima puede terminar
         fuera del disco. */
      const r = ALCANCE + ONDA_ALTO;
      tocados.push([(cx - r) * dpr, (cy - r) * dpr, r * 2 * dpr, r * 2 * dpr]);
    }
    const frentes: { x: number; y: number; frente: number; fuerza: number }[] = [];
    for (const o of l.ondas) {
      const edad = clamp01((ahora - o.t0) / ONDA_DUR);
      /* Sale rápido y se va frenando, como la onda de verdad. */
      const frente = ONDA_LEJOS * (1 - (1 - edad) * (1 - edad));
      frentes.push({ x: o.x, y: o.y, frente, fuerza: ONDA_ALTO * (1 - edad) });
      /* Con holgura: un punto de la cresta se corre hasta ONDA_ALTO hacia
         afuera, y si cae fuera de lo que se repone queda pegado ahí. */
      tocados.push(
        ...anillo(o.x, o.y, frente - ONDA_ANCHO - ONDA_ALTO, frente + ONDA_ANCHO + ONDA_ALTO, dpr),
      );
      sigue = true;
    }

    reponer(l, l.sucios.concat(tocados));
    l.sucios = tocados;

    /* Dos pasadas: si se borrara y dibujara punto por punto, el borrado de uno
       se comería al vecino que ya se movió encima de su casilla. */
    const bbox = tocados.reduce(
      (a, [x, y, rw, rh]) => [
        Math.min(a[0], x / dpr),
        Math.min(a[1], y / dpr),
        Math.max(a[2], (x + rw) / dpr),
        Math.max(a[3], (y + rh) / dpr),
      ],
      [Infinity, Infinity, -Infinity, -Infinity],
    );
    const i0 = Math.floor((bbox[0] - PASO) / PASO);
    const i1 = Math.ceil(bbox[2] / PASO);
    const j0 = Math.floor((bbox[1] - PASO) / PASO);
    const j1 = Math.ceil(bbox[3] / PASO);

    const falta = (i1 - i0) * (j1 - j0) * 2;
    if (l.destino.length < falta) l.destino = new Float32Array(falta + 2048);
    const destino = l.destino;
    let n = 0;

    for (let j = j0; j < j1; j++) {
      const y0 = j * PASO + PASO / 2;
      for (let i = i0; i < i1; i++) {
        const x0 = i * PASO + PASO / 2;
        let px = x0;
        let py = y0;

        /* El peso del puntero. La retícula no se corta en el borde de la
           sección: se recorren también las casillas de afuera, porque si no, al
           arrimar el mouse a la orilla los puntos de adentro se van hacia él y
           no entra nada a reemplazarlos, y queda un pedazo pelado. Los que
           terminan fuera del canvas los recorta el canvas solo. */
        if (cerca) {
          const dx = cx - x0;
          const dy = cy - y0;
          const d2 = dx * dx + dy * dy;
          if (d2 < ALCANCE * ALCANCE) {
            /* Al cuadrado: los de al lado se doblan harto y los del borde del
               alcance casi nada, así el límite no se lee como un círculo. */
            const q = 1 - Math.sqrt(d2) / ALCANCE;
            const tiron = q * q * FUERZA;
            px += dx * tiron;
            py += dy * tiron;
          }
        }

        /* La onda: una cresta que se va abriendo. Por delante del frente los
           puntos se abren hacia afuera y por detrás vuelven, que es lo que hace
           que se lea como UNA onda y no como un círculo que crece. */
        for (const o of frentes) {
          const dx = x0 - o.x;
          const dy = y0 - o.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 0.5) continue;
          const s = (d - o.frente) / ONDA_ANCHO;
          if (s < -1 || s > 1) continue;
          const alto = o.fuerza * Math.sin(Math.PI * s) * Math.exp(-s * s * 2);
          px += (dx / d) * alto;
          py += (dy / d) * alto;
        }

        if (Math.abs(px - x0) + Math.abs(py - y0) < MINIMO) continue;
        ctx.clearRect(x0 * dpr - l.lado, y0 * dpr - l.lado, l.lado * 2, l.lado * 2);
        destino[n++] = px * dpr - l.lado;
        destino[n++] = py * dpr - l.lado;
      }
    }

    ctx.globalAlpha = l.alpha;
    const sello = l.sello;
    if (sello) for (let k = 0; k < n; k += 2) ctx.drawImage(sello, destino[k], destino[k + 1]);
  }

  /* Mientras haya ondas vivas hay que seguir dibujando aunque nadie mueva el
     mouse. */
  if (sigue) pedir();
}

function pedir() {
  if (!pedido) pedido = requestAnimationFrame(dibujar);
}

function escucha() {
  if (escuchando) return;
  escuchando = true;
  window.addEventListener(
    "pointermove",
    (e) => {
      /* Solo mouse y lápiz: en una pantalla táctil el dedo tapa justo lo que
         habría que mirar, y deja la trama doblada donde se tocó. */
      if (e.pointerType === "touch") return;
      punteroX = e.clientX;
      punteroY = e.clientY;
      pedir();
    },
    { passive: true },
  );
  /* La gota. Va en `pointerdown` y no en `click`: la onda tiene que salir
     cuando se aprieta, no cuando se suelta. */
  window.addEventListener(
    "pointerdown",
    (e) => {
      const t0 = performance.now();
      for (const l of lentes) {
        const caja = l.canvas.getBoundingClientRect();
        /* En coordenadas de la sección, calculadas ahora: así la onda se queda
           donde se hizo clic aunque la página ruede mientras se abre. */
        l.ondas.push({ x: e.clientX - caja.left, y: e.clientY - caja.top, t0 });
        if (l.ondas.length > ONDAS_MAX) l.ondas.shift();
      }
      pedir();
    },
    { passive: true },
  );
  /* Al rodar la página la trama se mueve y el puntero no: los puntos que tiene
     debajo son otros. */
  window.addEventListener("scroll", pedir, { passive: true });
  window.addEventListener("resize", pedir);
  document.addEventListener("visibilitychange", pedir);
  document.addEventListener("pointerleave", () => {
    punteroX = -1e6;
    punteroY = -1e6;
    pedir();
  });
}

/**
 * Enciende la lente de una trama. Devuelve la función para apagarla.
 *
 * No hace nada con `prefers-reduced-motion`, ni donde no hay un puntero fino:
 * en el teléfono no hay «donde pasa el mouse».
 */
export function dotLens(canvas: HTMLCanvasElement, trama: HTMLElement): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};

  const lente: Lente = {
    canvas,
    trama,
    estatica: null,
    sello: null,
    w: 0,
    h: 0,
    dpr: 1,
    piel: "",
    alpha: 0.07,
    lado: 3,
    ondas: [],
    sucios: [],
    activa: false,
    destino: new Float32Array(8192),
  };
  lentes.add(lente);
  escucha();
  pedir();

  return () => {
    lentes.delete(lente);
    trama.removeAttribute("data-lens");
  };
}
