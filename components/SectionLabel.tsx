/**
 * Encabezado de sección: la regla roja corta del manual, la etiqueta en mono y
 * el título en DeLight. Está aquí para que todas las secciones abran igual.
 */
export default function SectionLabel({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <header className="mb-10 sm:mb-14">
      <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-accent-text mb-4">
        <span className="w-7 h-px bg-mark" aria-hidden />
        {label}
      </p>
      {/* Tracking algo más suelto que el titular del héroe: a -0.05em las
          tildes de DeLight se montan sobre la letra siguiente («Escríbenos»). */}
      <h2 className="font-sans font-light text-bone leading-[1.05] tracking-[-0.025em] text-[clamp(2rem,5.2vw,3.6rem)]">
        {title}
      </h2>
    </header>
  );
}
