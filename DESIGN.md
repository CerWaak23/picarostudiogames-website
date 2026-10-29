# DESIGN.md — Pícaro Game Studio

Traducción a código del manual de marca (`MANUAL DE MARCA/PÍCARO BRANDLINES.pdf`).
Los valores marcados **tinta** vienen del manual y no se tocan. El resto son
neutros derivados: OKLCH con un tinte mínimo hacia el verde de marca (hue 128)
para que ningún gris sea un gris muerto.

## Color

El sitio tiene **tres estilos**, los tres sacados del manual, y el visitante
elige con el selector de abajo a la derecha (`components/SkinSwitcher.tsx`).
La elección se guarda y se aplica antes del primer pintado.

| Estilo | De dónde sale | Fondo | Acento |
|---|---|---|---|
| `citrico` | El key visual (pág. 24) | grafito | Cítrico `#b4ef04` |
| `vino` | La página de fotografía (pág. 26) | negro | Vino `#e02135` |
| `papel` | Las páginas de logo y color | Blanco Pálido | Vino `#e02135` |

Ningún componente sabe en qué estilo está: todos los colores son variables CSS
(`--c-*`, una tanda por estilo en `globals.css`) nombradas en `tailwind.config.ts`.
Por eso en `papel` «ink» sigue siendo el fondo y «bone» el texto, solo que dados
vuelta. Para cambiar el estilo que ve alguien que llega por primera vez, mover
el bloque `:root` de `globals.css`.

Estrategia de color, igual en los tres: **committed**. Tres tintas planas, como
una risografía. El fondo manda la superficie, el acento carga la identidad, el
rojo puntúa.

Como el rojo de marca sobre fondo oscuro da 4.09:1, en `vino` el acento se parte
en tres papeles: `--c-accent` para tipografía grande y reglas (pasa 3:1),
`--c-accent-text` un punto más claro para texto chico, y `--c-accent-fill` un
punto más oscuro para que el texto blanco encima pase 4.5:1.

La tabla de abajo es la del estilo `citrico`; los otros dos mueven los mismos
tokens.

| Token | Hex | OKLCH | Rol |
|---|---|---|---|
| `ink` | `#161814` | 0.205 0.008 128 | Fondo de página |
| `ink-2` | `#232521` | 0.26 0.008 128 | Bloque elevado |
| `graphite` | `#383838` | 0.341 0 90 | **tinta** Negro Grafito. Tarjetas |
| `graphite-2` | `#3f403d` | 0.37 0.007 128 | Bordes, divisiones |
| `bone` | `#eeeeee` | 0.949 0 90 | **tinta** Blanco Pálido. Texto |
| `bone-dim` | `#a3a6a0` | 0.72 0.008 128 | Texto secundario (7.25:1) |
| `muted` | `#848782` | 0.62 0.009 128 | Etiquetas, meta (4.91:1) |
| `lime` | `#b4ef04` | 0.879 0.222 126 | **tinta** Cítrico. Acción y titulares |
| `red` | `#e02135` | 0.583 0.220 23 | **tinta** Vino Chileno. Solo acento |

Reglas:
- **La lima es el color de acción.** Botones, enlaces activos, foco. Texto
  `ink` sobre lima: 13:1.
- **El rojo nunca es texto chico.** 3.78:1 sobre `ink` no pasa AA. Se usa como
  barra, punto, "+" y la barra inclinada del manual. Nada que haya que leer.
- Secundarias del manual, disponibles para arte de juegos, no para la interfaz:
  vino `#580018`, océano `#00006e`, patagonia `#014104`, naranja `#f3590b`.

## Tipografía

Tres familias, como el manual.

| Familia | Uso | Notas |
|---|---|---|
| **DeLight** (`font-sans`) | Titulares y cuerpo | Variable 100–900, `app/fonts/delight-vf.ttf` |
| **JetBrains Mono** (`font-mono`) | Etiquetas, meta, datos | Vía `next/font/google` |
| **Ruina** (`font-display`) | Solo el lockup y nombres de juego | `app/fonts/ruina.ttf`. Mayúsculas. Nunca cuerpo |

Del manual (*Uso Tipográfico*): la línea ExtraLight va con tracking `-0.05em`,
Ruina con `-0.02em`, el cuerpo mono con `-0.02em`.

Escala: `clamp()` fluido. Contraste entre pasos ≥ 1.25. Cuerpo a 65–75ch.

## Formas

El manual no usa esquinas vivas en los elementos de interfaz. En el key visual
(pág. 24) los dos datos van dentro de una **cápsula completamente redondeada** y
el «+» es un **círculo**. Así que en la web:

- Botones, distintivos, etiquetas y la cápsula de datos: `rounded-full`.
- Tarjetas y bloques grandes: rectos, como los carteles de las págs. 22 y 23.
- El «+» del key visual es magenta `#c11350` (medido del PDF; no está en la
  tabla de color del manual, pero es el que usa la pieza). Vive en el token
  `--c-plus` y es igual en los tres estilos.

## Zona de seguridad

De la pág. 10: **el aire alrededor del logo lo da la letra «o» a la altura del
logotipo**. En la web eso se traduce en no apretar nunca el lockup contra el
borde de la barra ni contra el menú.

El logo además no se separa en letras, no se rota, no se desenfoca, no lleva
degradado y no va sobre un fondo que no contraste (pág. 9).

## Textura

- **Trama de puntos** (`.halftone`): patrón CSS, no imagen. La del héroe y el
  cierre es `.halftone-strong`.
- **El degradado es de color y de trama a la vez.** `.halftone-sweep` le pone
  una máscara diagonal a los puntos, así que van densos en la esquina del logo
  y se abren hacia la máscara, en la misma dirección que `.brand-glow`. No baja
  a cero: el otro extremo conserva algo de textura para que no quede liso.
  Los dos se mueven juntos en el barrido de cambio de estilo.
- **Resplandor verde** (`.brand-glow`): un solo radial suave arriba a la
  izquierda del héroe, como en el key visual. En ningún otro lado.
- Sin sombras de color, sin glow en texto, sin gradientes sobre tipografía.

## Logo

`public/brand/logo.svg` (lockup) y `public/brand/mark.svg` (la máscara sola),
extraídos como vector del brandbook. Ambos pintan con `currentColor`, así que
el color se decide en CSS. El manual prohíbe: separar las letras, degradados,
color fuera de paleta, desenfoque, rotación.

## Movimiento

- Transiciones de 150–400ms con `ease-out-quart` (`--ease`).
- Solo `transform` y `opacity`. Nunca propiedades de layout.
- Todo se apaga bajo `prefers-reduced-motion`.

Tres movimientos propios:

| Qué | Dónde | Cómo |
|---|---|---|
| Entrada de página | `app/template.tsx` | `pageEnter`, 0.42s. Next remonta el template en cada navegación |
| Entrada del héroe | `.rise` | 0.7s escalonada, una sola vez |
| Cambio de estilo | `lib/skinPaint.ts` | 1.85s en canvas. Ver abajo |

El cambio de estilo **se pinta por detrás**, no salta. Un frente diagonal
avanza desde la esquina de abajo a la derecha hacia la esquina del logo,
cubriendo el fondo con el color del estilo nuevo. Por delante del frente van
puntos que vuelan en el color de acento y se clavan en la retícula; detrás
queda la retícula ya armada. Es una obra en construcción: lo que ya se
construyó no se vuelve a mover.

Dos reglas que lo sostienen:

1. **El canvas va detrás del contenido** (`.skin-wave` en z-0, el contenido en
   z-10 desde `app/template.tsx`). Nunca tapa el logo, los textos ni las
   imágenes: lo que se rehace es el fondo.
2. **Los puntos aterrizan en la retícula de verdad**: misma separación de 6px,
   mismo color y misma opacidad que `.halftone-strong` del estilo nuevo, con la
   misma caída diagonal. Por eso al final el canvas se limpia de una y no
   aparece «otra imagen»: debajo ya está lo mismo, en el mismo sitio.

El estilo se aplica al 62% del recorrido, cuando el frente ya cruzó. Para que
28.000 puntos no se dibujen cuadro a cuadro, los que ya aterrizaron se pintan
una vez en un canvas aparte y cada cuadro solo se copia esa capa y se dibujan
los que van en el aire.

`html[data-switching]` corta las transiciones ese instante, solo las
transiciones y nunca las animaciones: apagar también `animation` mataba la
animación antes de que partiera. Con `prefers-reduced-motion` no hay pintura:
el estilo se aplica y listo.

## La máscara del héroe

Va rellena de forma **neutra** (grafito, degradado del color del estilo y
trama), no con arte de un juego: la portada es del estudio, no de uno de sus
títulos. El arte de cada juego vive en su propia página.

## Prohibido

Los vetos de `impeccable`, que aquí además chocan con el manual: franjas de
color en el borde de tarjetas, texto con degradado, glassmorphism decorativo,
la plantilla de métrica gigante, grillas de tarjetas idénticas, modales por
reflejo. Y sin rayas (—) en el copy.
