import { auth } from "@/auth";
import { projectsFor } from "@/lib/access";

export default async function Home() {
  const session = await auth();
  const mine = projectsFor(session?.user?.email);
  return (
    <main>
      <h1>Tus juegos</h1>
      <div className="grid">
        {mine.map(({ project, role }) => (
          <a key={project.id} href={`/p/${project.id}`} className="card">
            <strong>{project.name}</strong>
            <div className="muted">{role === "owner" ? "Owner" : "Solo lectura"}</div>
            <div>{project.modules.map((m) => <span key={m} className="tag">{m}</span>)}</div>
          </a>
        ))}
      </div>
      {mine.length === 0 && <p className="muted">No tienes juegos asignados.</p>}
    </main>
  );
}
