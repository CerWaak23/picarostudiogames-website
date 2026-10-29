"use client";

/**
 * Next vuelve a montar este archivo en cada navegación (a diferencia de
 * layout.tsx, que se mantiene), así que es el lugar donde poner la entrada de
 * página. La animación está en globals.css y se apaga sola con
 * `prefers-reduced-motion`.
 *
 * El z-10 deja todo el contenido por encima del canvas donde se pinta el
 * cambio de estilo (`.skin-wave`, en z-0), que va detrás a propósito.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter relative z-10">{children}</div>;
}
