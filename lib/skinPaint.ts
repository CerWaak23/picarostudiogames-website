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
 *    (6px), redondos como ella y con su mismo color y opacidad, así que cuando
 *    el canvas se va al final no aparece «otra imagen»: debajo ya está lo
 *    mismo, en el mismo lugar. Y no se va de golpe: se cruza con la página.
 *
 * 3. Cada punto viaja solo la primera mitad de su tramo; la segunda ya está en
 *    su sitio y solo se asienta, perdiendo el brillo y pasando del color de
 *    acento al de reposo. Sin eso se leían como dos cosas distintas: unos
 *    puntos que volaban y otros, quietos, que aparecían de la nada.
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

const DUR = 1700;
/** Qué parte de la animación tarda el frente en cruzar la pantalla entera. */
const CRUCE = 0.73;
/** Igual que el `background-size` de .halftone-strong. */
const GRID = 6;
/** Qué parte del recorrido dura el viaje + el asentamiento de cada punto. */
const FLIGHT = 0.24;
/** De ese tramo, cuánto es viaje: el resto el punto ya está en su sitio y solo se apaga. */
const TRAVEL = 0.5;
/**
 * Ancho de la caída del frente. Angosto se lee como un corte; ancho, como una
 * sombra difusa por debajo de los puntos, que es lo que tiene que ser: los
 * puntos van adelante y la tinta los sigue sin que se vea una línea.
 */
const EDGE = 0.16;
/** Cuánto se adelanta el recorte de la copia al frente. Fijo: no sigue a EDGE,
 *  para poder tocar el difuminado sin mover el momento en que cambian las letras. */
const ADELANTO = 0.13;
/** Hasta dónde llega la atracción del puntero, en pixeles de pantalla. Amplio a
 *  propósito: el enjambre pasa por un punto dado durante menos de medio segundo,
 *  así que con un alcance chico el efecto existe pero no alcanza a verse. */
const IMAN = 300;
/** Cuánto se desvía un punto que pasa justo por encima del puntero (0 a 1). */
const IMAN_FUERZA = 0.8;
/** El canvas se va cruzándose con la página, no de un tijeretazo. */
const HANDOFF = 0.12;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
/** Arranca y termina suave. El frente la usa para no gastarse media pantalla en
 *  el primer tercio: con `easeOut` el enjambre entero despegaba de una y casi
 *  no se alcanzaba a ver volar nada. */
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

function channels(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Un punto redondo, como los de la trama CSS (que es un radial-gradient, no un cuadro). */
function disc(c: CanvasRenderingContext2D, x: number, y: number, radius: number, fill: string) {
  c.fillStyle = fill;
  c.beginPath();
  c.arc(x, y, radius, 0, Math.PI * 2);
  c.fill();
}

type Rgb = [number, number, number];
const rgba = (c: Rgb, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
/** Del color de vuelo al color en reposo, para que el punto que llega sea el que se queda. */
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];

/**
 * Dónde está el puntero, en pixeles de CSS. Se sigue SIEMPRE, no solo mientras
 * dura el barrido: quien aprieta una muestra deja el mouse quieto encima, así
 * que durante la animación no llega ni un `pointermove` y el imán no haría nada
 * justo en el caso más común. Un listener pasivo, puesto una vez.
 */
let punteroX = -1e6;
let punteroY = -1e6;
let siguiendo = false;
function sigueAlPuntero() {
  if (siguiendo || typeof window === "undefined") return;
  siguiendo = true;
  window.addEventListener(
    "pointermove",
    (e) => {
      punteroX = e.clientX;
      punteroY = e.clientY;
    },
    { passive: true },
  );
}

export function paintSkin(
  canvas: HTMLCanvasElement,
  /** El estilo que se va: se pinta por DELANTE del frente, donde todavía no llega. */
  from: SkinPaint,
  /** El que entra: se pinta por detrás. */
  colors: SkinPaint,
  /**
   * Se llama al empezar, no a mitad de camino. Como el canvas tapa la pantalla
   * entera (viejo adelante, nuevo atrás), el DOM puede cambiar de color desde el
   * primer cuadro sin que se note por debajo, y así las letras y los botones
   * cambian al mismo ritmo que el fondo en vez de saltar al final.
   */
  onApply: () => void,
  /**
   * Cada cuadro, con la coordenada diagonal del frente (1 = abajo a la derecha,
   * 0 = la esquina del logo). SkinSwitcher la usa para recortar la capa con el
   * estilo viejo, y así las letras y los botones se pintan en el mismo orden y
   * la misma dirección que el fondo.
   */
  onFront: (u: number) => void,
  onDone: () => void
) {
  sigueAlPuntero();

  const ctx0 = canvas.getContext("2d");
  if (!ctx0) {
    onApply();
    onFront(-1);
    onDone();
    return () => {};
  }
  /* Alias sin null: `terminar()` es una declaración y TypeScript no le arrastra
     el estrechamiento del if de arriba. */
  const ctx = ctx0;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const cssW = window.innerWidth;
  const cssH = window.innerHeight;
  const W = Math.round(cssW * dpr);
  const H = Math.round(cssH * dpr);
  if (W < 2 || H < 2) {
    /* Ventana sin tamaño (minimizada, panel colapsado, contenedor sin medir
       todavía). Dibujar acá revienta con «canvas de ancho 0» y, como la
       excepción corta todo antes de armar las redes de abajo, la copia del
       estilo viejo se quedaría encima tapando el sitio. Mejor sin animación. */
    onApply();
    onFront(-1);
    onDone();
    return () => {};
  }

  canvas.width = W;
  canvas.height = H;
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  canvas.style.opacity = "1";

  /* La capa de lo ya construido: se dibuja una vez por punto y no se toca más. */
  const settled = document.createElement("canvas");
  settled.width = W;
  settled.height = H;
  const sctx = settled.getContext("2d");
  if (!sctx) {
    onApply();
    onFront(-1);
    onDone();
    return () => {};
  }

  const ink = channels(colors.ink);
  const dot = channels(colors.dot);
  const accent = channels(colors.accent);

  const step = GRID * dpr;
  const r = 1.35 * dpr;

  /* Un sello con el punto en reposo, dibujado UNA vez. Clavar un punto es copiar
     esta imagen con la opacidad que le toque: mucho más barato que un arco por
     punto, que con miles aterrizando en el mismo cuadro se notaba como tirón. */
  const stampR = Math.ceil(r) + 1;
  const stamp = document.createElement("canvas");
  stamp.width = stamp.height = stampR * 2;
  const stampCtx = stamp.getContext("2d");
  if (stampCtx) disc(stampCtx, stampR, stampR, r, rgba(dot, 1));

  /* Los colores del vuelo, en escalones, calculados UNA vez.

     En cada cuadro van miles de puntos en el aire, y `fillStyle = "rgba(...)"`
     hace que el navegador parsee un color CSS por punto. Medido en esta misma
     pantalla con 14.762 puntos en el aire: 10 ms de los 16,7 que tiene un cuadro
     a 60 Hz, y no por armar el string ni por mezclar el color (con un string fijo
     cuesta lo mismo), sino por el parseo. Con el color en escalones, y como
     `flying` está casi ordenado por lo asentado que va cada punto, `fillStyle`
     cambia unas decenas de veces por cuadro en vez de catorce mil: 2,8 ms.

     La opacidad sí es de cada punto, así que va en `globalAlpha`, que es un
     número y no se parsea.

     32 escalones y no más: con 64, el temblor que lleva cada punto lo hace
     saltar de escalón en casi cada vuelta y volvemos a parsear por punto
     (medido: 20 ms, peor que el original). */
  const PASOS = 32;
  const paleta: string[] = [];
  for (let i = 0; i <= PASOS; i++) paleta.push(rgba(mix(accent, dot, i / PASOS), 1));
  /* El alcance del imán al cuadrado, para comparar sin sacar raíces. */
  const alcance2 = IMAN * dpr * (IMAN * dpr);

  const cols = Math.ceil(W / step) + 1;
  const rows = Math.ceil(H / step) + 1;

  /* La trama del héroe se abre en diagonal (.halftone-sweep). Acá se repite esa
     caída para que lo construido calce con lo que hay debajo. */
  const falloff = (x: number, y: number) => {
    /* Con `Math.sqrt` y no `Math.hypot`: esto corre una vez por celda, o sea
       45.000 veces dentro del clic, y `hypot` cuesta bastante más. */
    const ex = (x / W + 0.02) / 0.95;
    const ey = (y / H + 0.08) / 1.05;
    const d = Math.sqrt(ex * ex + ey * ey);
    return 1 - clamp01((d - 0.15) / 1.1) * 0.85;
  };

  /* Orden de construcción: por diagonal, de abajo-derecha a arriba-izquierda. */
  const uOf = (x: number, y: number) => (x / W + y / H) / 2;

  /* La capa de adelante: el fondo y la trama del estilo que se va. Se dibuja una
     vez y se copia en cada cuadro. Gracias a ella el canvas tapa la pantalla
     entera de punta a punta, y por eso el DOM puede cambiar desde el principio. */
  const below = document.createElement("canvas");
  below.width = W;
  below.height = H;
  const belowCtx = below.getContext("2d");
  if (belowCtx) {
    belowCtx.fillStyle = rgba(channels(from.ink), 1);
    belowCtx.fillRect(0, 0, W, H);

    /* La trama del estilo que se va. De una sola pasada con un patrón y una
       máscara: punto por punto eran veinte mil dibujos en el mismo cuadro del
       clic, y eso se sentía como un tirón justo al empezar. */
    const lado = Math.max(1, Math.round(step));
    const tile = document.createElement("canvas");
    tile.width = tile.height = lado;
    const tileCtx = tile.getContext("2d");
    const trama = document.createElement("canvas");
    trama.width = W;
    trama.height = H;
    const tramaCtx = trama.getContext("2d");
    if (tileCtx && tramaCtx) {
      disc(tileCtx, lado / 2, lado / 2, r, rgba(channels(from.dot), 1));
      const patron = tramaCtx.createPattern(tile, "repeat");
      if (patron) {
        tramaCtx.fillStyle = patron;
        tramaCtx.fillRect(0, 0, W, H);
        /* La misma caída diagonal de `falloff()`, pero como degradado: densa en
           la esquina del logo y abriéndose hacia la contraria. */
        tramaCtx.globalCompositeOperation = "destination-in";
        const caida = tramaCtx.createRadialGradient(0, 0, 0, 0, 0, Math.hypot(W, H) * 1.05);
        caida.addColorStop(0, `rgba(0,0,0,${from.dotAlpha})`);
        caida.addColorStop(1, `rgba(0,0,0,${from.dotAlpha * 0.15})`);
        tramaCtx.fillStyle = caida;
        tramaCtx.fillRect(0, 0, W, H);
        belowCtx.drawImage(trama, 0, 0);
      }
    }
  }

  let raf = 0;
  /** Índice del siguiente punto que falta clavar, recorriendo por diagonales. */
  /* `t0` va declarado acá aunque se llene al despegar: si se le agrega una
     propiedad después de crearlo, V8 le cambia la forma a los 45.000 objetos y
     los pasa a modo diccionario, que encarece tanto armarlos como leerlos en
     cada cuadro. */
  const pending: { x: number; y: number; u: number; ox: number; oy: number; a: number; dur: number; t0: number }[] = [];
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
        /* Desorden en el despegue Y en lo que tarda el vuelo. Sin esto, todos los
           puntos de una misma diagonal salen y llegan a la vez y el borde vuelve a
           ser una línea recta, que es justo lo que hay que evitar. Con el desorden
           el relevo se lee como lo que es: puntos cayendo. */
        u: uOf(x, y) + (Math.random() - 0.5) * 0.025,
        /* Llegan volando desde abajo a la derecha, con algo de dispersión. */
        ox: dist * (0.8 + Math.random() * 0.45),
        oy: dist * (0.55 + Math.random() * 0.45),
        a,
        /* Poca variación a propósito: con un rango ancho el borde se desarma y
           los puntos quedan despegados unos de otros. Lo justo para que no se
           abran todos juntos por diagonal. */
        dur: FLIGHT * (0.94 + Math.random() * 0.12),
        /* Se llena cuando el frente lo alcanza. */
        t0: 0,
      });
    }
  }
  /* De la diagonal más lejana a la más cercana a la esquina, por CUBETAS y no
     con `sort`: ordenar 45.000 objetos con un comparador era lo más caro de
     toda la preparación, y la preparación entera pasa dentro del clic, antes
     de que se dibuje el primer cuadro. Repartirlos en cubetas de `u` es O(n) y
     no compara nada.

     Dentro de una cubeta el orden queda cualquiera, y da igual: una cubeta
     cubre 1/2048 de la diagonal, menos de lo que avanza el frente en un cuadro,
     así que un punto puede despegar un cuadro antes o después de lo que le
     tocaba. El temblor de `u` ya los desordena bastante más que eso a propósito. */
  const CUBETAS = 2048;
  const cubeta = (u: number) => {
    const c = (u * CUBETAS) | 0;
    return c < 0 ? 0 : c >= CUBETAS ? CUBETAS - 1 : c;
  };
  {
    const cuantos = new Int32Array(CUBETAS);
    for (const p of pending) cuantos[cubeta(p.u)]++;
    /* Dónde empieza cada cubeta, recorriéndolas de la más alta a la más baja. */
    const cursor = new Int32Array(CUBETAS);
    let acc = 0;
    for (let c = CUBETAS - 1; c >= 0; c--) {
      cursor[c] = acc;
      acc += cuantos[c];
    }
    const ordenado: typeof pending = new Array(pending.length);
    for (const p of pending) ordenado[cursor[cubeta(p.u)]++] = p;
    for (let k = 0; k < ordenado.length; k++) pending[k] = ordenado[k];
  }

  let nextIdx = 0;
  const flying: typeof pending = [];
  const t0 = performance.now();

  const frame = (now: number) => {
    /* Si un cuadro falla, se termina igual: lo que no puede pasar es que la
       copia del estilo viejo se quede encima tapando la página. */
    try {
      const t = clamp01((now - t0) / DUR);
      const avance = smooth(clamp01(t / CRUCE));
      /* El frente, en coordenada diagonal: 1 = abajo-derecha, 0 = la esquina. */
      const front = 1 - avance * 1.08;
      /* El recorte va medio ancho de caída por delante del frente, que es donde
         el fondo nuevo ya pesa más que el viejo. Se calcula aparte y no como
         `front + EDGE / 2` porque ESE valor nunca llega a cero: `front` se queda
         en -0.08 y, sumada la media caída, el recorte tocaba suelo en 0.05. Eso
         dejaba una punta del estilo viejo clavada en la esquina del logo durante
         los últimos 760 ms, hasta que la retiraba el cierre. Así llega a cero
         justo cuando el frente termina de cruzar, sin tocar el paso del fondo. */
      onFront((1 + ADELANTO) * (1 - avance));

      /* Despegan los que el frente acaba de alcanzar. */
      while (nextIdx < pending.length && pending[nextIdx].u >= front) {
        const p = pending[nextIdx++];
        p.t0 = t;
        flying.push(p);
      }

      /* Primero, lo que todavía no cambia: el estilo que se va, de punta a punta.
         Con esto el canvas nunca deja ver la página, que ya tiene el estilo nuevo
         desde el primer cuadro. */
      if (belowCtx) ctx.drawImage(below, 0, 0);
      else ctx.clearRect(0, 0, W, H);

      /* Encima, el fondo nuevo. La caída va CENTRADA en el mismo borde donde se
         recorta el contenido, no en `front`: son parámetros distintos (`front`
         va por la diagonal `u`, el degradado por la proyección) y, al ensanchar
         la caída, la mancha de tinta se despegaba del borde del texto y se veían
         DOS líneas, una difusa y otra nítida, en sitios distintos.

         El ancho crece y se cierra (parábola): cero al empezar, máximo a mitad
         de camino y cero al terminar. Con ancho fijo, o se asomaba tinta nueva
         en la esquina al arrancar o quedaba a medio pintar la del logo al final. */
      const g = ctx.createLinearGradient(W, H, 0, 0);
      const bordeTexto = (1 + ADELANTO) * avance - ADELANTO;
      /* La tinta nueva entra justo donde la copia de arriba retira la vieja: una
         se abre mientras la otra se cierra, en la misma franja `EDGE`, así que
         se cruzan y se lee como UNA sola caída y no como dos manchas. */
      g.addColorStop(0, rgba(ink, 1));
      g.addColorStop(clamp01(bordeTexto), rgba(ink, 1));
      g.addColorStop(clamp01(bordeTexto + EDGE), rgba(ink, 0));
      g.addColorStop(1, rgba(ink, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      /* Lo ya construido, de una sola copia. */
      ctx.drawImage(settled, 0, 0);

      /** Qué escalón de `paleta` está puesto; -1 = ninguno todavía. */
      let ultimoEscalon = -1;
      /* Lo que va en el aire. Al llegar a 1 se clava en la capa de abajo y no se
         vuelve a dibujar nunca más: por eso no hay salto al final. */
      for (let k = flying.length - 1; k >= 0; k--) {
        const p = flying[k];
        const local = clamp01((t - p.t0) / p.dur);
        if (local >= 1) {
          /* Clavado: redondo y con el color y la opacidad exactos de la trama real,
             así al retirarse el canvas la textura no cambia. */
          sctx.globalAlpha = p.a;
          sctx.drawImage(stamp, p.x - stampR, p.y - stampR);
          flying.splice(k, 1);
          continue;
        }
        /* Primero viaja. El resto del tramo ya está en su sitio y solo se asienta:
           pierde el brillo y toma el color de reposo sin moverse, para que se vea
           que el punto que llegó es el que se queda. */
        const e = easeOut(clamp01(local / TRAVEL));
        /* El apagado va parejo (smooth), no de golpe: si no, el punto se apaga
           apenas toca su sitio y parece que hubiera aterrizado otro. */
        const settle = smooth(clamp01((local - TRAVEL) / (1 - TRAVEL)));
        const glow = 1 - settle;
        const entra = clamp01(local / 0.18);
        /* En el aire va de cuadro: a este tamaño no se distingue de un círculo y
           son miles por cuadro. Redondo importa solo al clavarse, que es lo que
           tiene que calzar con la trama de CSS. */
        const rr = r * (1 + glow * 1.1);
        let px = p.x + p.ox * (1 - e);
        let py = p.y + p.oy * (1 - e);
        /* El puntero tira de los que pasan cerca: se curvan hacia él, como si
           pesara. La fuerza cae con la distancia y se apaga con el punto, así que
           al aterrizar queda EXACTO en su casilla de la trama y el relevo con el
           CSS sigue siendo invisible. */
        const dx = punteroX * dpr - px;
        const dy = punteroY * dpr - py;
        /* Comparado al cuadrado, que la raíz solo hace falta para los pocos que
           caen dentro del alcance: `Math.hypot` por punto es de lo más caro que
           hay en este bucle. */
        const d2 = dx * dx + dy * dy;
        if (d2 < alcance2 && d2 > 0.25) {
          /* Al cuadrado: los que pasan al lado se doblan harto y los del borde
             del alcance casi nada, así el límite no se lee como un círculo
             recortado por más que se agrande. */
          const cerca = 1 - Math.sqrt(d2) / (IMAN * dpr);
          const tiron = cerca * cerca * IMAN_FUERZA * glow;
          px += dx * tiron;
          py += dy * tiron;
        }
        const escalon = (settle * PASOS) | 0;
        if (escalon !== ultimoEscalon) {
          ctx.fillStyle = paleta[escalon];
          ultimoEscalon = escalon;
        }
        ctx.globalAlpha = (p.a + 0.5 * glow) * entra;
        ctx.fillRect(px - rr, py - rr, rr * 2, rr * 2);
      }

      /* La opacidad vuelve a 1. El cuadro que viene arranca copiando capas
         enteras con `drawImage` y saldrían lavadas. */
      ctx.globalAlpha = 1;

      /* Entrega: la página de abajo ya tiene el estilo nuevo desde el principio,
         así que el canvas se cruza con ella en vez de irse de un tijeretazo. */
      const salida = clamp01((t - (1 - HANDOFF)) / HANDOFF);
      canvas.style.opacity = salida > 0 ? String(1 - easeOut(salida)) : "1";

      if (t < 1) raf = requestAnimationFrame(frame);
      else terminar();
    } catch {
      terminar();
    }
  };

  /**
   * Fin, venga de donde venga. Tiene que poder llamarse dos veces sin romper
   * nada: la capa de arriba es una copia de la página y, si no se retira, se
   * queda tapándola.
   */
  let listo = false;
  function terminar() {
    if (listo) return;
    listo = true;
    cancelAnimationFrame(raf);
    window.clearTimeout(corte);
    document.removeEventListener("visibilitychange", siSeOculta);
    ctx.clearRect(0, 0, W, H);
    canvas.style.opacity = "1";
    /* Por si quedó a medias: que no tape nada. */
    onFront(-1);
    onDone();
  }

  /* Red de seguridad. Si los cuadros dejan de llegar (la pestaña se va a segundo
     plano y el navegador congela requestAnimationFrame, por ejemplo), la copia
     se quedaría encima para siempre. Con esto siempre se retira. */
  function siSeOculta() {
    if (document.hidden) terminar();
  }
  const corte = window.setTimeout(terminar, DUR + 600);
  document.addEventListener("visibilitychange", siSeOculta);

  /* El DOM cambia YA: el canvas lo tapa entero, así que lo único que se ve del
     cambio son las letras, las reglas y los botones cruzándose de color, al
     mismo ritmo con que avanza el frente. */
  onApply();
  raf = requestAnimationFrame(frame);

  return terminar;
}
