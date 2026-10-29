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

/** El canvas lo monta SkinSwitcher una sola vez; acá queda a mano para poder
 *  usarlo también desde las muestras del menú del teléfono. */
let canvasEl: HTMLCanvasElement | null = null;

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
      /* El salto de color queda tapado por la pintura, pero igual se cortan las
         transiciones: si no, todo lo que tiene `transition-colors` para el
         hover se pondría a desvanecer por debajo y saldría sucio al destaparse. */
      html.dataset.switching = "";
      html.dataset.skin = id;
      void html.offsetWidth;
      const clear = () => delete html.dataset.switching;
      requestAnimationFrame(() => requestAnimationFrame(clear));
      window.setTimeout(clear, 80);
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

    cancel.current?.();
    cancel.current = paintSkin(
      canvasEl,
      { ink: target.ink, accent: target.accent, dot: target.dot, dotAlpha: target.dotAlpha },
      apply,
      () => {
        cancel.current = null;
      }
    );
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
 * La pastilla fija (solo de `sm` para arriba) y el canvas donde se pinta el
 * cambio, que va aparte porque tiene que existir también en teléfono, donde el
 * selector vive dentro del menú.
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

      <div className="hidden sm:flex fixed bottom-4 right-4 z-[90] items-center gap-1 bg-ink-2/95 backdrop-blur-sm border border-graphite-2 pl-3 pr-2 py-1.5 print:hidden">
        <span
          aria-hidden
          className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted mr-1"
        >
          Estilo
        </span>
        <SkinChips />
      </div>
    </>
  );
}
