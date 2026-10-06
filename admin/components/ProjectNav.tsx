"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import type { IconName } from "@/lib/modules";

export type NavItem = { href: string; label: string; icon: IconName; exact?: boolean };

/** Escritorio: barra lateral. Celular: pestañas que se deslizan, pegadas bajo la barra superior. */
export default function ProjectNav({ game, role, items }: { game: string; role: string; items: NavItem[] }) {
  const path = usePathname();
  return (
    <nav className="nav" aria-label={`Secciones de ${game}`}>
      <div className="nav-inner">
        <div className="nav-head">
          <div className="game">{game}</div>
          <div className="role">{role}</div>
          <Link href="/">Todos los juegos</Link>
        </div>
        <div className="nav-list">
          {items.map((it) => {
            const active = it.exact ? path === it.href : path === it.href || path.startsWith(it.href + "/");
            return (
              <Link key={it.href} href={it.href} className="nav-item" aria-current={active ? "page" : undefined}>
                <Icon name={it.icon} />
                {it.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
