import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { runAdmin } from "@/lib/run";
import PlaytestersList, { type Person } from "./PlaytestersList";

/** Guardado tal como lo deja el script: sin las fechas ya escritas. */
type Stored = Omit<Person, "atLabel" | "updatedLabel">;

const when = (unix: number) =>
  unix
    ? new Date(unix * 1000).toLocaleString("es-CL", { timeZone: "America/Santiago", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "sin fecha";

/**
 * Quién se anotó en la lista de espera del playtesting desde la web
 * (picarogamestudio.com/games/fitness-era). Lo guarda el script de Cloud Code `Playtesters`.
 *
 * Son correos de gente que todavía no juega: el listado los muestra tapados y hay que apretar
 * para verlos. La lectura queda en la auditoría.
 */
export default async function Playtesters(props: { params: Promise<{ project: string }> }) {
  const params = await props.params;
  const session = await auth();
  let access;
  try {
    access = requireAccess(session?.user?.email, params.project);
  } catch {
    notFound();
  }
  const { project } = access;
  if (!project.modules.includes("playtesters")) notFound();

  const res = await runAdmin<{ people?: Stored[] }>(project.id, "playtesters.list", {});
  // Las fechas se escriben acá: el mismo toLocaleString da distinto en Node que en el navegador,
  // y si el cliente las arma otra vez React se queja de que el HTML no calza.
  const people: Person[] = (res.data?.people ?? []).map((p) => ({
    ...p,
    atLabel: when(p.at),
    updatedLabel: p.updated ? when(p.updated) : undefined,
  }));

  return (
    <>
      <div className="page-head">
        <h1>Lista de espera</h1>
        <p>Quien dejó su correo en la página del juego para probar el playtesting. Escríbeles cuando haya build.</p>
      </div>

      {!res.ok && <p className="notice err">No se pudo leer: {res.message}</p>}

      {res.ok && people.length === 0 ? (
        <div className="panel empty">
          <strong>Nadie se ha anotado todavía.</strong>El formulario está en la página de {project.name}, al final.
        </div>
      ) : (
        <PlaytestersList people={people} game={project.name} />
      )}
    </>
  );
}
