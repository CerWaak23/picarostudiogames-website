"use client";

import { useEffect, useRef, useState } from "react";
import { paintSkin } from "@/lib/skinPaint";

/**
 * Selector de estilo. Las tres pieles salen del manual, así que cambiar de una
 * a otra no se sale de marca en ningún momento. La elección se guarda y la
 * aplica el script de app/layout.tsx antes del primer pintado.
 *
 * En pantalla grande vive en una pastilla fija abajo a la derecha. En teléfono
 * esa pastilla taparía el pie de página y la cápsula del héroe, así que ahí las
 * muestras van dentro del menú, al lado del cambio de idioma.
 *
 * El cambio en sí lo dibuja lib/skinPaint.ts sobre un canvas: un frente que
 * pinta el color nuevo con un enjambre de puntos por delante. Los colores van
 * acá escritos a mano porque hay que conocer los del estilo NUEVO antes de
 * aplicarlo, y las variables CSS solo saben del activo.
 */

/* `dot` y `dotAlpha` tienen que calzar con `--dot` y `--dot-alpha-strong` de
   globals.css: los puntos que vuelan aterrizan justo encima de los de la trama
   real, y por eso al final el canvas se puede ir sin que se note el relevo. */
export const SKINS = [
  { id: "citrico", name: "Cítrico", bg: "#232521", ink: "#161814", accent: "#b4ef04", dot: "#eeeeee", dotAlpha: 0.07 },
  { id: "vino", name: "Vino", bg: "#221918", ink: "#130c0c", accent: "#e02135", dot: "#eeeeee", dotAlpha: 0.065 },
  { id: "papel", name: "Papel", bg: "#eeeeee", ink: "#eeeeee", accent: "#cb0028", dot: "#252421", dotAlpha: 0.1 },
] as const;

export type Skin = (typeof SKINS)[number]["id"];

export const SKIN_KEY = "picaro-skin";

/** Ancho de la franja en que el fondo saliente se abre, en coordenada diagonal.
 *  Tiene que ser el mismo `EDGE` de lib/skinPaint.ts para que la tinta vieja se
 *  retire justo donde entra la nueva y se lea como UNA caída, no como dos. */
const BANDA = 0.16;

/** El canvas lo monta SkinSwitcher una sola vez; acá queda a mano para poder
 *  usarlo también desde las muestras del menú del teléfono. */
let canvasEl: HTMLCanvasElement | null = null;

/** Todas las variables que definen un estilo (`:root[data-skin=…]` en globals.css). */
const VARS = [
  "--c-ink", "--c-ink-2", "--c-graphite", "--c-graphite-2", "--c-bone", "--c-bone-dim",
  "--c-muted", "--c-accent", "--c-accent-text", "--c-accent-fill", "--c-accent-on",
  "--c-mark", "--c-plus", "--dot", "--dot-alpha", "--dot-alpha-strong", "--glow",
  "--glow-alpha", "--c-art", "--art-opacity",
];

/**
 * El canvas rehace el fondo, pero las letras, los bordes y los botones viven en
 * el DOM y cambiarían todos a la vez. Para que el frente también los vaya
 * pintando, se deja encima una COPIA del contenido congelada en el estilo que se
 * va, y se la recorta con la misma diagonal: donde ya pasó el frente se ve el
 * contenido de verdad, ya con el estilo nuevo; donde todavía no, se ve la copia.
 *
 * Las paletas están declaradas en `:root`, así que a la copia hay que ponerle los
 * valores salientes a mano: se leen del documento justo antes de cambiarlo.
 */
function capaSaliente(): { recortar: (u: number) => void; quitar: () => void } | null {
  const contenido = document.querySelector<HTMLElement>(".page-enter");
  if (!contenido || typeof contenido.cloneNode !== "function") return null;

  /* La dirección en que crece la coordenada diagonal: la normal a las líneas de
     `u` constante es (1/ancho, 1/alto). En CSS 0deg apunta hacia arriba y gira
     en el sentido del reloj, de ahí este atan2; en una ventana cuadrada da
     135deg. Y como `u` y la proyección sobre esa dirección son la misma función
     lineal (0 en el origen, 1 en la esquina opuesta), el porcentaje del
     degradado ES `u * 100`, sin más conversión. */
  const angulo = ((Math.atan2(1 / window.innerWidth, -1 / window.innerHeight) * 180) / Math.PI + 360) % 360;

  const actual = getComputedStyle(document.documentElement);
  const capa = document.createElement("div");
  capa.setAttribute("aria-hidden", "true");
  /* Marca para apagarle las animaciones (globals.css): al clonar, las entradas
     del héroe (`.rise`) vuelven a empezar y arrancan en opacidad 0, así que la
     copia salía lavada en vez de idéntica a lo que había. */
  capa.setAttribute("data-skin-copy", "");
  /* z-11: justo encima del contenido (z-10) y debajo del selector de estilo. */
  capa.style.cssText = "position:fixed;inset:0;z-index:11;pointer-events:none;overflow:hidden;contain:paint;";
  for (const v of VARS) {
    const valor = actual.getPropertyValue(v);
    if (valor) capa.style.setProperty(v, valor);
  }
  /* El fondo de la copia lo pone `recortar` en cada cuadro: es un degradado que
     se desvanece hacia el borde, no un color plano. Tiene que seguir tapando el
     contenido real de abajo (si no, se ven los dos textos y salen fantasma),
     pero solo donde está entero; en la franja del borde se abre y deja pasar la
     tinta nueva del canvas. */
  const tintaVieja = `rgb(${actual.getPropertyValue("--c-ink")})`;

  /* El borde roto. `desorden` se sortea UNA vez por animación: si se sorteara en
     cada cuadro, los dientes temblarían en vez de avanzar. */
  const W = window.innerWidth;
  const H = window.innerHeight;
  /* El borde se recorta con ARCOS de círculo del tamaño de la trama, no con
     dientes: así el cambio de color toma la forma de los puntos y no una forma
     inventada. `mordiscos` decide cuáles muerden hacia dentro y cuáles hacia
     fuera, y se sortea una vez por animación para que no tiemble. */
  const PASO = 13;
  const mordiscos = Array.from({ length: 97 }, () => (Math.random() < 0.5 ? 0 : 1));

  /* La copia va donde estaría el contenido si no hubiéramos hecho scroll. */
  const marco = document.createElement("div");
  marco.style.cssText = `position:absolute;left:0;top:${-window.scrollY}px;width:${contenido.offsetWidth}px;`;
  const copia = contenido.cloneNode(true) as HTMLElement;
  /* Sin la entrada de página: es una copia, no una navegación. */
  copia.classList.remove("page-enter");
  copia.style.animation = "none";
  marco.appendChild(copia);
  capa.appendChild(marco);
  document.body.appendChild(capa);

  return {
    /**
     * `u` es la diagonal del frente. Los dos recortes son complementarios y de
     * bordes vivos: la copia se queda con lo que el frente aún no alcanzó y el
     * contenido real con el resto. Nunca se solapan, así que no hay fantasma, y
     * como ninguna de las dos capas lleva fondo, el que se ve es el del canvas,
     * difuminado. El borde solo se nota en el texto, que es donde tiene que
     * notarse: no hay una raya de color cruzando la pantalla.
     */
    recortar: (u: number) => {
      const s = u * 2;
      /* El texto se corta con borde VIVO: dos formas semitransparentes encimadas
         siempre darían fantasma. Pero el borde no es una recta ni una forma
         inventada: es una fila de ARCOS del tamaño de la trama, unos mordiendo
         hacia dentro y otros hacia fuera, así que el cambio de color toma la
         forma de los puntos. */
      if (s <= 0) {
        capa.style.clipPath = "path('M 0 0 Z')";
      } else if (s >= 2) {
        capa.style.clipPath = "none";
      } else {
        const [ax, ay, bx, by] = s <= 1 ? [s * W, 0, 0, s * H] : [W, (s - 1) * H, (s - 1) * W, H];
        const largo = Math.hypot(bx - ax, by - ay);
        const pasos = Math.max(2, Math.round(largo / PASO));
        /* El radio va un pelo por encima de la media cuerda: si queda justo, el
           redondeo deja arcos imposibles y el navegador los agranda solo. */
        const r = (largo / pasos) * 0.52;
        let d =
          s <= 1
            ? `M 0 0 L ${ax.toFixed(1)} ${ay.toFixed(1)}`
            : `M 0 0 L ${W} 0 L ${ax.toFixed(1)} ${ay.toFixed(1)}`;
        for (let k = 1; k <= pasos; k++) {
          const f = k / pasos;
          const x = ax + (bx - ax) * f;
          const y = ay + (by - ay) * f;
          d += ` A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 ${mordiscos[k % mordiscos.length]} ${x.toFixed(1)} ${y.toFixed(1)}`;
        }
        d += s <= 1 ? " Z" : ` L 0 ${H} Z`;
        capa.style.clipPath = `path('${d}')`;
      }

      /* El FONDO de la copia, en cambio, se desvanece hacia el borde en vez de
         cortarse: por debajo ya está la tinta nueva del canvas, así que los dos
         colores se cruzan en la misma franja donde el texto da el salto. Antes
         este fondo era un color plano y su borde recto era, él solo, la línea
         que se veía cruzar la pantalla. */
      const desde = Math.max(0, (u - BANDA) * 100);
      const hasta = Math.max(0.01, u * 100);
      capa.style.background = `linear-gradient(${angulo}deg, ${tintaVieja} ${desde}%, transparent ${hasta}%)`;
    },
    quitar: () => capa.remove(),
  };
}

export function useSkin() {
  const [skin, setSkin] = useState<Skin>("citrico");
  const cancel = useRef<(() => void) | null>(null);

  useEffect(() => {
    const applied = document.documentElement.dataset.skin as Skin | undefined;
    if (applied) setSkin(applied);
    return () => cancel.current?.();
  }, []);

  const pick = (id: Skin) => {
    const html = document.documentElement;
    const target = SKINS.find((s) => s.id === id);
    if (!target || html.dataset.skin === id) return;

    const apply = () => {
      /* Nada se desvanece: lo viejo lo sigue mostrando la capa de arriba hasta
         que el frente la recorta. Se apagan las transiciones para que ningún
         `transition-colors` de hover se ponga a mezclar por debajo. */
      html.dataset.painting = "";
      html.dataset.skin = id;
      void html.offsetWidth;
      const limpiar = () => delete html.dataset.painting;
      requestAnimationFrame(() => requestAnimationFrame(limpiar));
      window.setTimeout(limpiar, 120);
    };

    setSkin(id);
    try {
      localStorage.setItem(SKIN_KEY, id);
    } catch {
      /* modo privado: el estilo igual se aplica, solo no se recuerda */
    }

    /* Si el equipo pide menos movimiento, o todavía no hay canvas, se cambia y
       punto: la animación nunca es la que manda. */
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (quieto || !canvasEl) {
      apply();
      return;
    }

    /* El que se va lo pinta el canvas por delante del frente, así que hay que
       pasárselo: sin eso la página de abajo se asomaría ya cambiada. */
    const saliente = SKINS.find((s) => s.id === html.dataset.skin) ?? SKINS[0];
    const capa = capaSaliente();

    cancel.current?.();
    try {
      cancel.current = paintSkin(
        canvasEl,
        { ink: saliente.ink, accent: saliente.accent, dot: saliente.dot, dotAlpha: saliente.dotAlpha },
        { ink: target.ink, accent: target.accent, dot: target.dot, dotAlpha: target.dotAlpha },
        apply,
        (u) => capa?.recortar(u),
        () => {
          capa?.quitar();
          cancel.current = null;
        }
      );
    } catch {
      /* Última red: si la animación ni siquiera arranca, el estilo se aplica y
         la copia se retira. Dejarla puesta taparía la página entera. */
      capa?.quitar();
      cancel.current = null;
      apply();
    }
  };

  return { skin, pick };
}

/** Las tres muestras. Se usan sueltas en el menú del teléfono. */
export function SkinChips({ className = "" }: { className?: string }) {
  const { skin, pick } = useSkin();

  return (
    <div role="radiogroup" aria-label="Estilo del sitio" className={`flex items-center gap-1 ${className}`}>
      {SKINS.map((s) => {
        const active = skin === s.id;
        return (
          <button
            key={s.id}
            role="radio"
            aria-checked={active}
            onClick={() => pick(s.id)}
            title={s.name}
            /* 36px de lado: sigue siendo un blanco cómodo en el teléfono. */
            className="group grid place-items-center w-9 h-9 transition-transform duration-200 ease-out-quart hover:scale-110"
          >
            <span className="sr-only">{s.name}</span>
            <span
              aria-hidden
              className={`grid place-items-center w-5 h-5 border transition-colors duration-200 ${
                active ? "border-bone" : "border-graphite-2 group-hover:border-bone-dim"
              }`}
              style={{ backgroundColor: s.bg }}
            >
              <span
                className={`block transition-all duration-200 ease-out-quart ${
                  active ? "w-2.5 h-2.5" : "w-2 h-2"
                }`}
                style={{ backgroundColor: s.accent }}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * La pastilla fija y el canvas donde se pinta el cambio, que va aparte porque
 * tiene que existir en todos los tamaños.
 *
 * La pastilla se ve SIEMPRE, también en teléfono. Antes se escondía por debajo
 * de `sm` y las muestras quedaban solo dentro del menú, pero ahí no se
 * encuentran: parecía que el selector hubiera desaparecido. En pantalla angosta
 * se compacta (sin la palabra «Estilo») para estorbar lo menos posible.
 */
export default function SkinSwitcher() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    canvasEl = canvas.current;
    return () => {
      canvasEl = null;
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} className="skin-wave" aria-hidden />

      <div className="flex fixed bottom-4 right-4 z-[90] items-center gap-1 bg-ink-2/95 backdrop-blur-sm border border-graphite-2 pl-1.5 pr-1 sm:pl-3 sm:pr-2 py-1.5 print:hidden">
        <span
          aria-hidden
          className="hidden sm:inline font-mono text-[11px] tracking-[0.2em] uppercase text-muted mr-1"
        >
          Estilo
        </span>
        <SkinChips />
      </div>
    </>
  );
}
