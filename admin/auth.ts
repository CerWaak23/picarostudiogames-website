import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isAllowedEmail } from "@/lib/access";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 }, // sesión de 8 horas
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    // Solo correos de Google verificados Y listados en algún projects/*.ts.
    async signIn({ profile }) {
      return profile?.email_verified === true && isAllowedEmail(profile.email);
    },
    // Cada petición vuelve a revisar: si quitas un correo de la lista, queda fuera de inmediato.
    authorized({ auth: session, request }) {
      const path = request.nextUrl.pathname;
      // El login y el retorno de Google (/api/auth/*) deben poder pasar sin sesión.
      if (path.startsWith("/login") || path.startsWith("/api/auth")) return true;
      return isAllowedEmail(session?.user?.email);
    },
  },
});
