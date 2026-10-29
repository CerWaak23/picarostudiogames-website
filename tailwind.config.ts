import type { Config } from "tailwindcss";

/**
 * Los colores son variables CSS definidas en app/globals.css, una tanda por
 * piel (citrico / vino / papel). Acá solo se nombran, para que una clase como
 * `bg-accent/40` siga funcionando con opacidad. Ver DESIGN.md.
 */
const c = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: c("ink"),
        "ink-2": c("ink-2"),
        graphite: c("graphite"),
        "graphite-2": c("graphite-2"),
        /** El tinte del tiki del héroe, aparte del de las superficies. */
        art: c("art"),
        bone: c("bone"),
        "bone-dim": c("bone-dim"),
        muted: c("muted"),

        /** Tipografía grande, reglas y bordes en color de marca. */
        accent: c("accent"),
        /** El mismo papel pero para texto chico: medido para pasar AA. */
        "accent-text": c("accent-text"),
        /** Relleno del botón primario y el texto que va encima. */
        "accent-fill": c("accent-fill"),
        "accent-on": c("accent-on"),
        /** Los cuadraditos y reglas de puntuación: siempre rojo de marca. */
        mark: c("mark"),
        /** El magenta del botón «+» del key visual (medido del PDF: #c11350). */
        plus: c("plus"),

        /* Alias de compatibilidad con el sitio anterior. */
        bg: c("ink"),
        surface: c("ink-2"),
        "surface-2": c("graphite"),
        "text-primary": c("bone"),
        "text-secondary": c("bone-dim"),
      },
      fontFamily: {
        sans: ["var(--font-delight)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-ruina)", "var(--font-delight)", "sans-serif"],
      },
      letterSpacing: {
        /* Del manual, «Uso Tipográfico»: -50 y -20 sobre 1000. */
        headline: "-0.05em",
        display: "-0.02em",
        body: "-0.02em",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.165, 0.84, 0.44, 1)",
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};

export default config;
