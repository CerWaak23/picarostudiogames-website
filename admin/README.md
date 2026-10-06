# Pícaro Admin

Panel de administración del estudio, para todos los juegos. Next.js + Auth.js (Google).

- **Login:** solo correos listados en `projects/*.ts` (campo `roles`).
- **Un juego = un archivo** en `projects/` + una línea en `projects/index.ts`.
- **Backends:** `lib/backends/` (hoy `ugs`: service account → Cloud Code).
- **Seguridad:** las llaves van solo en variables de entorno del servidor (`.env.example`); roles por juego
  (`owner` / `viewer`); `requireAccess()` en cada página y acción; auditoría en `lib/audit.ts`.

## Local
```
cp .env.example .env.local   # completa los valores
npm run dev                  # http://localhost:3100
```

## Estado
Núcleo y login listos. Módulos (kpis, players, ban, codes, messages, admins, audit) pendientes.
Falta probar el adaptador `ugs` con un service account real.
