# FORMULARIOS.md — qué hay que configurar para que guarden

La web tiene dos formularios que guardan datos de gente:

| Dónde | Qué pide | Dónde se ve |
|---|---|---|
| `/games/fitness-era`, sección Playtesting | correo (obligatorio), nombre, plataforma | Panel → Fitness Era → **Playtesting** |
| Home, sección «Trabajemos juntos» | nombre y correo (obligatorios), área, enlace, mensaje | Panel → Pícaro Game Studio → **Trabajar juntos** |

**Mientras no esté configurado lo de abajo, los dos responden «no se pudo
guardar» y lo dejan anotado en los logs de Vercel. No se caen, pero no guardan
nada.** Lo que escriba la gente se pierde, así que conviene cerrar esto antes de
repartir el enlace.

## Cómo funciona por debajo

    navegador → POST /api/playtesting  ó  /api/colaboradores   (route handler, servidor)
              → token-exchange de Unity con un service account
              → Cloud Code: script Playtesters / Colaboradores, acción "anotar"
              → Cloud Save: custom item `playtesters` / `colaboradores`

Es el mismo camino que ya usa el panel (`admin/lib/backends/ugs.ts`), así que no
hay una segunda base de datos. La llave del service account se lee **solo en el
servidor**; el navegador nunca la ve.

## 1. Publicar los dos scripts en Unity Dashboard

Los archivos viven en el proyecto de Unity de Fitness Era, en `Cloud/scripts/`:

- `Playtesters.js`
- `Colaboradores.js`

En *Cloud Code → Scripts*, uno por archivo, con el **mismo nombre** del archivo
(sin `.js`). O con la línea de comandos:

```
& "$env:APPDATA\npm\ugs.cmd" deploy Cloud/scripts/Playtesters.js Cloud/scripts/Colaboradores.js
```

Los dos declaran menos de 10 parámetros, así que no chocan con el tope de Cloud
Code que tumbó a `Jugadores` y `Mensajes` en octubre de 2026. Igual conviene
revisar la sección «Failed to deploy» de la salida: cuando falla, deja la versión
anterior publicada y no avisa en ninguna otra parte.

## 2. Crear un service account para la web

En *Unity Cloud → Administration → Service Accounts*, uno nuevo llamado
`picaro-web`, con permiso **solo de ejecutar Cloud Code**.

Es **uno solo para todos los formularios del sitio**, no uno por juego ni uno por
formulario. Lo único que saben hacer es anotar a alguien en una lista, así que
separarlos no compraría nada y sí multiplicaría las llaves que mantener. Si algún
día un formulario necesita algo más pesado, ese se lleva su propia cuenta.

Lo que sí tiene que ser distinto es la llave del **panel**. El panel está detrás
de login de Google y lista blanca de correos; la web es pública. Si algún día se
filtra la llave de la web, lo peor que puede hacer es anotar gente en una lista:
los scripts de administración (`Jugadores`, `Codigos`, `Mensajes`…) rechazan a
quien no esté en su lista de admins, y este no está.

Cuando un juego nuevo tenga formulario, no hace falta otra cuenta: a la misma se
le agrega ese proyecto de Unity con los mismos roles de Cloud Code, y a Vercel
solo sus dos ids (`UGS_<JUEGO>_PROJECT_ID` y `UGS_<JUEGO>_ENV_ID`).

## 3. Variables de entorno en Vercel

En el proyecto de Vercel **de la web** (no el del panel):

```
UGS_FITNESSERA_PROJECT_ID=     # Unity Dashboard → Project Settings. No es secreto.
UGS_FITNESSERA_ENV_ID=         # ídem. Es el mismo valor que usa el panel.
UGS_WEB_KEY=                   # Key ID del service account picaro-web
UGS_WEB_SECRET=                # su Secret
```

Están también en `.env.example`. Para probar en local, copiar ese archivo a
`.env.local`.

El panel **no** necesita variables nuevas: usa las que ya tenía.

## 4. Nada que tocar en el juego

Ninguno de los dos scripts habla con el cliente de Unity. No hay versión nueva
de la app ni cambios en el proyecto de Unity más allá de publicar los scripts.

## Probar que quedó bien

1. Anotarse desde `/games/fitness-era` con un correo de prueba.
2. Entrar al panel → Fitness Era → Playtesting. Tiene que aparecer, con la fecha.
3. Lo mismo con «Trabajemos juntos» de la home → panel → Pícaro Game Studio.
4. Anotarse dos veces con el mismo correo: **no** debe duplicarse, debe
   actualizar la fila y conservar la fecha original.

Si algo falla, el motivo queda en los logs de Vercel (`playtesting:` o
`colaboradores:`) y en *Cloud Code → Logs* de Unity.

## Privacidad

Son datos personales de gente que no juega todavía.

- En el panel los correos salen **tapados** (`and•••@gmail.com`) y hay que
  apretar «Ver correos» para leerlos. El CSV sí los baja completos, que para eso
  se exporta.
- Leer cualquiera de las dos listas queda registrado en Auditoría.
- La IP de quien envía **no se guarda en ninguna parte**: se usa revuelta y solo
  en memoria, para el límite de 5 envíos cada 10 minutos.
- El formulario de Fitness Era enlaza a `/games/fitness-era/privacidad#lista-de-espera`,
  que explica qué se guarda y cómo pedir que se borre. La política del juego
  (`lib/fitnessEraLegal.ts`) **no** se tocó a propósito: tiene que decir lo mismo
  que la pantalla de consentimiento dentro del juego (`LegalTexts.cs`), así que
  la lista de espera va como bloque aparte.
- El de «Trabajemos juntos» explica para qué se usan los datos en la misma
  sección. Si algún día la web del estudio tiene su propia página de privacidad,
  ahí habría que repetirlo con más detalle.

## Freno al abuso

Sin dependencias nuevas: validación en el servidor, campo trampa invisible,
5 envíos cada 10 minutos por IP (en memoria, así que en serverless cada
instancia lleva su cuenta), deduplicación por correo y un tope de 20.000 por
lista. Si algún día llega spam de verdad, lo siguiente es el firewall de Vercel,
no código nuevo acá.
