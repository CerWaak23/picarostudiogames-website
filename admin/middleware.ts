export { auth as middleware } from "@/auth";

export const config = {
  // Todo queda detrás del login, salvo los archivos estáticos.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
