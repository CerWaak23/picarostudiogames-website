import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { MODULES } from "@/lib/modules";
import ProjectNav, { type NavItem } from "@/components/ProjectNav";

export default async function ProjectLayout({ children, params }: { children: React.ReactNode; params: Promise<{ project: string }> }) {
  const { project: id } = await params;
  const session = await auth();
  let access;
  try {
    access = requireAccess(session?.user?.email, id);
  } catch {
    notFound();
  }
  const { project, role } = access;

  const items: NavItem[] = [
    { href: `/p/${project.id}`, label: "Resumen", icon: "home", exact: true },
    ...project.modules
      .filter((m) => MODULES[m]?.ready)
      .map((m) => ({ href: `/p/${project.id}/${m}`, label: MODULES[m].label, icon: MODULES[m].icon })),
  ];

  return (
    <div className="frame">
      <ProjectNav game={project.name} role={role === "owner" ? "Owner" : "Solo lectura"} items={items} />
      <main className="content">{children}</main>
    </div>
  );
}
