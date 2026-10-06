import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { requireAccess } from "@/lib/access";
import { runAdmin } from "@/lib/run";
import PhotoActions from "./PhotoActions";

type Photo = { id: string; name: string; img: string };

/** La imagen sale del servidor ya validada, pero se vuelve a comprobar antes de ponerla en la página. */
const isJpegBase64 = (s: string) => typeof s === "string" && s.length < 60000 && s.startsWith("/9j/") && /^[A-Za-z0-9+/=]+$/.test(s);

export default async function Photos(props: { params: Promise<{ project: string }> }) {
  const params = await props.params;
  const session = await auth();
  let access;
  try {
    access = requireAccess(session?.user?.email, params.project);
  } catch {
    notFound();
  }
  const { project, role } = access;
  if (!project.modules.includes("photos")) notFound();

  const res = await runAdmin<{ fotos?: Photo[]; pendientes?: number }>(project.id, "photos.list", {}, { target: "pendientes" });
  const fotos = (res.data?.fotos ?? []).filter((f) => isJpegBase64(f.img));
  const total = res.data?.pendientes ?? fotos.length;

  return (
    <>
      <div className="page-head">
        <h1>Fotos de perfil</h1>
        <p>Nadie más ve una foto hasta que la apruebes. Si la rechazas, se borra y el jugador puede subir otra.</p>
      </div>

      {!res.ok && <p className="notice err">No se pudo leer: {res.message}</p>}

      {res.ok && fotos.length === 0 ? (
        <div className="panel empty"><strong>Nada por revisar.</strong>Los retratos están al día.</div>
      ) : (
        <>
          <div className="section-title">
            <h2>Pendientes</h2>
            <span>{total > fotos.length ? `${fotos.length} de ${total}, el resto aparece al revisar` : `${total}`}</span>
          </div>
          <div className="photo-grid">
            {fotos.map((f) => (
              <div key={f.id} className="panel photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`data:image/jpeg;base64,${f.img}`} alt={`Foto de ${f.name || "jugador sin nombre"}`} width={160} height={160} />
                <span className="who">
                  <strong>{f.name || "Sin nombre"}</strong>
                  <span className="mono faint">{f.id.slice(0, 8)}</span>
                </span>
                {role === "owner" ? <PhotoActions projectId={project.id} target={f.id} /> : <p className="faint" style={{ textAlign: "center", fontSize: "0.82rem" }}>Solo lectura</p>}
              </div>
            ))}
          </div>
          <p className="faint" style={{ marginTop: 14, fontSize: "0.82rem" }}>
            Son fotos de personas reales: no las descargues ni las compartas.
          </p>
        </>
      )}
    </>
  );
}
