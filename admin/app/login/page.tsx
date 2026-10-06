import { signIn } from "@/auth";

export default async function Login(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="center">
      <div className="card" style={{ maxWidth: 360, textAlign: "center" }}>
        <h1>Pícaro Admin</h1>
        <p className="muted">Acceso solo para cuentas autorizadas.</p>
        {searchParams.error && <p className="err">Esa cuenta no tiene acceso.</p>}
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button className="btn">Entrar con Google</button>
        </form>
      </div>
    </div>
  );
}
