"use client";

import { useEffect, useRef } from "react";
import { dotLens } from "@/lib/dotLens";

/**
 * La trama de puntos de una sección, con su lente: donde pasa el mouse los
 * puntos se doblan hacia él, como si pesara (lib/dotLens.ts).
 *
 * El canvas va DENTRO del div de la trama, no al lado: así hereda su máscara
 * y su sitio exacto. Mientras dibuja, el div apaga su propia trama y la pone el
 * canvas entera. Los dos van antes del contenido de la sección, que al ser
 * posicionado se pinta encima: la lente no toca los textos.
 *
 * `sweep` es la caída diagonal del héroe (`.halftone-sweep`). No hay que
 * repetirla en el canvas: al estar adentro, la máscara del div ya se la aplica.
 *
 * No se usa en las tramas que van DENTRO del arte del héroe: esas cuelgan de un
 * padre con la máscara del logo y su propia opacidad, y la lente dibuja la
 * trama de su sección entera, no la de un recorte con forma de marca.
 */
export default function Trama({ sweep = false }: { sweep?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const trama = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvas.current || !trama.current) return;
    return dotLens(canvas.current, trama.current);
  }, []);

  return (
    <div
      ref={trama}
      aria-hidden
      className={`absolute inset-0 halftone-strong halftone-lens${sweep ? " halftone-sweep" : ""}`}
    >
      <canvas ref={canvas} className="dot-lens" />
    </div>
  );
}
