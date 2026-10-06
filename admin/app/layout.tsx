import type { Metadata } from "next";
import { auth, signOut } from "@/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pícaro Admin",
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="es">
      <body>
        {session?.user && (
          <header className="bar">
            <a href="/" className="brand">Pícaro Admin</a>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <span className="muted" style={{ marginRight: 12 }}>{session.user.email}</span>
              <button className="btn ghost">Salir</button>
            </form>
          </header>
        )}
        {children}
      </body>
    </html>
  );
}
