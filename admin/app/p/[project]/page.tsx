import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";

/** Módulos ya construidos; el resto aparece como pendiente. */
const READY = ["kpis", "players", "messages", "feedback", "codes"];

export default async function ProjectPage({ params }: { params: { project: string } }) {
  const session = await auth();
  let access;
  try {
    access = requireAccess(session?.user?.email, params.project);
  } catch {
    notFound();
  }
  const { project, role } = access;
  return (
    <main>
      <p><a href="/">← Juegos</a></p>
      <h1>{project.name}</h1>
      <p className="muted">Rol: {role}. Los módulos se activan uno a uno.</p>
      <div className="grid">
        {project.modules.map((m) =>
          READY.includes(m) ? (
            <a key={m} href={`/p/${project.id}/${m}`} className="card">
              <strong>{m}</strong>
              <div className="muted">Disponible</div>
            </a>
          ) : (
            <div key={m} className="card">
              <strong>{m}</strong>
              <div className="muted">Pendiente</div>
            </div>
          ),
        )}
      </div>
    </main>
  );
}
