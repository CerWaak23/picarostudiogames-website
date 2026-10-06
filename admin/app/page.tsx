import Link from "next/link";
import { auth } from "@/auth";
import { projectsFor } from "@/lib/access";
import { MODULES } from "@/lib/modules";
import Icon from "@/components/Icon";

export default async function Home() {
  const session = await auth();
  const mine = projectsFor(session?.user?.email);
  return (
    <main className="content" style={{ margin: "0 auto" }}>
      <div className="page-head">
        <h1>Tus juegos</h1>
        <p>Elige uno para ver cómo va y moderarlo.</p>
      </div>
      {mine.length === 0 ? (
        <div className="panel empty"><strong>No tienes juegos asignados.</strong>Pídele acceso al owner.</div>
      ) : (
        <div className="panel rows">
          {mine.map(({ project, role }) => (
            <Link key={project.id} href={`/p/${project.id}`} className="row">
              <div className="main">
                <div className="title">{project.name}</div>
                <div className="sub">
                  {project.modules.filter((m) => MODULES[m]?.ready).map((m) => MODULES[m].label).join(" · ")}
                </div>
              </div>
              <div className="aside">{role === "owner" ? "Owner" : "Solo lectura"}</div>
              <Icon name="chevron" className="chev" />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
