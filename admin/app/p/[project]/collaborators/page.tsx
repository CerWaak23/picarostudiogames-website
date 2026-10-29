import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { runAdmin } from "@/lib/run";
import CollaboratorsList, { type Person } from "./CollaboratorsList";

/** Guardado tal como lo deja el script: sin la fecha ya escrita. */
type Stored = Omit<Person, "atLabel" | "updatedLabel">;

const when = (unix: number) =>
  unix
    ? new Date(unix * 1000).toLocaleString("es-CL", { timeZone: "America/Santiago", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "sin fecha";

/**
 * Quién quiere trabajar en un proyecto del estudio. Llega por el formulario de la home
 * (picarogamestudio.com, sección «Trabajemos juntos») y lo guarda el script `Colaboradores`.
 *
 * Son datos de gente de afuera: el listado tapa los correos y hay que apretar para verlos.
 */
export default async function Collaborators(props: { params: Promise<{ project: string }> }) {
  const params = await props.params;
  const session = await auth();
  let access;
  try {
    access = requireAccess(session?.user?.email, params.project);
  } catch {
    notFound();
  }
  const { project, role } = access;
  if (!project.modules.includes("collaborators")) notFound();

  const res = await runAdmin<{ people?: Stored[] }>(project.id, "collaborators.list", {});
  // Las fechas se escriben acá: toLocaleString no da lo mismo en Node que en el navegador, y si
  // el cliente las arma otra vez React se queja de que el HTML no calza.
  const people: Person[] = (res.data?.people ?? []).map((p) => ({
    ...p,
    atLabel: when(p.at),
    updatedLabel: p.updated ? when(p.updated) : undefined,
  }));
  const pending = people.filter((p) => !p.done).length;

  return (
    <>
      <div className="page-head">
        <h1>Trabajar juntos</h1>
        <p>Quien dejó sus datos en la web para meterse en un proyecto. Contéstale a quien te sirva y marca el resto como revisado.</p>
      </div>

      {!res.ok && <p className="notice err">No se pudo leer: {res.message}</p>}

      {res.ok && people.length === 0 ? (
        <div className="panel empty">
          <strong>Nadie ha escrito todavía.</strong>El formulario está al final de la home, antes del contacto.
        </div>
      ) : (
        <CollaboratorsList people={people} pending={pending} projectId={project.id} owner={role === "owner"} />
      )}
    </>
  );
}
