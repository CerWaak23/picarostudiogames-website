import { signIn } from "@/auth";

export default async function Login(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="gate">
      <div className="gate-box">
        <h1>Panel del estudio</h1>
        <p className="tag">En el fin del mundo, inicia la picardía.</p>
        <p className="lead">Entra con tu cuenta de Google. Solo pasan las cuentas autorizadas.</p>
        {searchParams.error && <p className="notice err" style={{ marginBottom: 14 }}>Esa cuenta no tiene acceso.</p>}
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button className="btn" style={{ width: "100%" }}>Entrar con Google</button>
        </form>
      </div>
    </div>
  );
}
