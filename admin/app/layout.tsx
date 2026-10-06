import type { Metadata, Viewport } from "next";
import { auth, signOut } from "@/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pícaro Admin",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0e0e15" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="es">
      <body>
        <header className="appbar">
          <a href="/" className="brand">
            Pícaro <small>Admin</small>
          </a>
          {session?.user && (
            <form
              className="who"
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <span className="email">{session.user.email}</span>
              <button className="btn quiet sm">Salir</button>
            </form>
          )}
        </header>
        {children}
      </body>
    </html>
  );
}
