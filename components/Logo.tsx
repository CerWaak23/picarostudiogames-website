/**
 * El logo y la máscara del manual, pintados con una máscara CSS en vez de un
 * <img>: así el color sale de un token (`className="bg-accent"`) y el SVG no
 * entra al bundle. Las proporciones son las del archivo original.
 *
 * El manual prohíbe separar las letras, rotarlo, desenfocarlo, aplicarle
 * degradado o usarlo en un color fuera de la paleta.
 */

type Props = {
  /** Alto en px. El ancho sale solo de la proporción del archivo. */
  height?: number;
  /** Clase de color de fondo, que es lo que termina pintando la forma. */
  className?: string;
  title?: string;
};

/** Lockup completo: PÍCARO GAME STUDIO con la máscara. */
export function Logo({ height = 40, className = "bg-bone", title = "Pícaro Game Studio" }: Props) {
  return (
    <span
      role="img"
      aria-label={title}
      className={`mask-logo block shrink-0 ${className}`}
      style={{ height, width: height * (411.1 / 322.73) }}
    />
  );
}

/** Solo la máscara, para espacios chicos (favicon, pie, barra reducida). */
export function Mark({ height = 28, className = "bg-accent", title = "Pícaro" }: Props) {
  return (
    <span
      role="img"
      aria-label={title}
      className={`mask-pic block shrink-0 ${className}`}
      style={{ height, width: height * (108.47 / 168.04) }}
    />
  );
}
