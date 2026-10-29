"use client";

import { useId, useState } from "react";
import SectionLabel from "@/components/SectionLabel";
import { useLang } from "@/lib/LanguageContext";

/**
 * «Trabajemos juntos»: artistas, músicos, programadores y gente de historia que quiera meterse
 * en un proyecto del estudio. Manda a /api/colaboradores, que lo guarda en Unity Gaming Services
 * y lo deja visible en el panel.
 *
 * Formas del manual: campos y botones `rounded-full`, etiquetas en mono, todo por token
 * (ver DESIGN.md). La sección va antes del cierre de contacto, que sigue siendo para prensa.
 */

const AREAS = ["arte", "musica", "codigo", "narrativa", "produccion", "otro"] as const;
type Area = (typeof AREAS)[number];

const copy = {
  es: {
    label: "Trabajemos juntos",
    title: "Faltan manos, no ideas.",
    intro:
      "El estudio es una persona, y hay más ideas que manos. Si haces arte, música, código, historia o producción y quieres meterte en un proyecto, cuéntame qué sabes hacer.",
    aside:
      "No hay sueldo fijo esperándote: las condiciones se conversan proyecto a proyecto. Te escribo cuando haya algo donde calces.",
    name: "Nombre",
    nameHint: "Cómo te llamas",
    email: "Correo",
    emailHint: "tu@correo.cl",
    area: "¿Qué haces?",
    areas: { arte: "Arte", musica: "Música y sonido", codigo: "Código", narrativa: "Historia", produccion: "Producción", otro: "Otra cosa" },
    link: "Dónde ver tu trabajo (opcional)",
    linkHint: "https://",
    note: "Cuéntame algo (opcional)",
    noteHint: "En qué te gustaría meterte, o qué hiciste antes",
    submit: "Mandar",
    sending: "Mandando",
    privacy:
      "Guardo tu correo y lo que escribas acá solo para contestarte. No se comparte con nadie y lo borro si me lo pides.",
    okTitle: "Llegó",
    okText: "Lo leo yo, no un robot. Si calza con algo que esté armando, te escribo.",
    againTitle: "Actualizado",
    againText: "Ya tenía tu correo, así que guardé lo nuevo encima de lo anterior.",
    errEmail: "Ese correo no se ve bien. Revísalo.",
    errName: "Falta tu nombre.",
    errRate: "Muchos intentos seguidos. Espera un par de minutos.",
    errBackend: "No se pudo mandar. Intenta de nuevo en un rato, o escríbeme a",
  },
  en: {
    label: "Let's work together",
    title: "Ideas aren't the problem. Hands are.",
    intro:
      "The studio is one person, and there are more ideas than hands. If you do art, music, code, writing or production and want in on a project, tell me what you're good at.",
    aside:
      "There's no salary waiting for you: terms get worked out project by project. I'll write when there's something you'd fit.",
    name: "Name",
    nameHint: "What you go by",
    email: "Email",
    emailHint: "you@email.com",
    area: "What do you do?",
    areas: { arte: "Art", musica: "Music and sound", codigo: "Code", narrativa: "Writing", produccion: "Production", otro: "Something else" },
    link: "Where to see your work (optional)",
    linkHint: "https://",
    note: "Tell me something (optional)",
    noteHint: "What you'd like to work on, or what you've done before",
    submit: "Send",
    sending: "Sending",
    privacy:
      "I keep your email and what you write here only to reply. It isn't shared with anyone and I delete it if you ask.",
    okTitle: "Got it",
    okText: "I read these myself, not a robot. If it fits something I'm building, I'll write.",
    againTitle: "Updated",
    againText: "I already had your email, so I saved the new version over the old one.",
    errEmail: "That email doesn't look right. Check it.",
    errName: "Your name is missing.",
    errRate: "Too many tries in a row. Wait a couple of minutes.",
    errBackend: "Couldn't send it. Try again in a bit, or write to me at",
  },
};

const EMAIL = "picarogamestudio@gmail.com";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "ok"; again: boolean } | { kind: "error"; code: string };

export default function CollaborateSection() {
  const { lang } = useLang();
  const c = copy[lang];
  const id = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState<Area>("arte");
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state.kind === "sending") return;
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/colaboradores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, area, link, note, website, lang }),
      });
      const body = (await res.json().catch(() => null)) as { ok?: boolean; again?: boolean; code?: string } | null;
      if (res.ok && body?.ok) setState({ kind: "ok", again: body.again === true });
      else setState({ kind: "error", code: body?.code ?? "backend" });
    } catch {
      setState({ kind: "error", code: "backend" });
    }
  }

  const sending = state.kind === "sending";
  const err = state.kind === "error" ? state.code : "";

  return (
    <section id="trabajemos" className="py-20 sm:py-28 px-6 bg-ink-2 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionLabel label={c.label} title={c.title} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,26rem)] gap-12 lg:gap-16 items-start">
          <div className="max-w-prose">
            <p className="text-bone-dim text-lg leading-relaxed">{c.intro}</p>
            <p className="text-muted text-sm leading-relaxed mt-5">{c.aside}</p>
          </div>

          {state.kind === "ok" ? (
            <div className="border border-accent/40 bg-ink px-6 py-5" role="status">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-text mb-2">
                {state.again ? c.againTitle : c.okTitle}
              </p>
              <p className="text-sm text-bone-dim leading-relaxed">{state.again ? c.againText : c.okText}</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-4">
              <Field id={`${id}-name`} label={c.name}>
                <input
                  id={`${id}-name`}
                  type="text"
                  required
                  autoComplete="name"
                  maxLength={60}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={c.nameHint}
                  aria-invalid={err === "name" || undefined}
                  className={input(err === "name")}
                />
              </Field>

              <Field id={`${id}-email`} label={c.email}>
                <input
                  id={`${id}-email`}
                  type="email"
                  required
                  autoComplete="email"
                  maxLength={120}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={c.emailHint}
                  aria-invalid={err === "email" || undefined}
                  className={input(err === "email")}
                />
              </Field>

              <fieldset className="flex flex-col gap-2">
                <legend className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted mb-2">{c.area}</legend>
                <div className="flex flex-wrap gap-2">
                  {AREAS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      aria-pressed={area === a}
                      onClick={() => setArea(a)}
                      className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors ${
                        area === a
                          ? "border-accent bg-accent-fill text-accent-on"
                          : "border-graphite-2 text-bone-dim hover:border-accent/50 hover:text-bone"
                      }`}
                    >
                      {c.areas[a]}
                    </button>
                  ))}
                </div>
              </fieldset>

              <Field id={`${id}-link`} label={c.link}>
                <input
                  id={`${id}-link`}
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  maxLength={300}
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder={c.linkHint}
                  className={input(false)}
                />
              </Field>

              <Field id={`${id}-note`} label={c.note}>
                <textarea
                  id={`${id}-note`}
                  rows={4}
                  maxLength={600}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={c.noteHint}
                  className="w-full rounded-3xl border border-graphite-2 bg-ink px-5 py-3 text-sm text-bone placeholder:text-muted outline-none transition-colors hover:border-graphite focus:border-accent resize-y"
                />
              </Field>

              {/* Campo trampa: invisible para una persona, irresistible para un robot. */}
              <div aria-hidden className="h-0 w-0 overflow-hidden">
                <label htmlFor={`${id}-website`}>No llenar</label>
                <input id={`${id}-website`} type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="rounded-full bg-accent-fill text-accent-on font-mono font-bold text-xs tracking-[0.18em] uppercase px-6 py-3.5 transition-colors hover:bg-bone disabled:opacity-60 disabled:hover:bg-accent-fill"
              >
                {sending ? `${c.sending}…` : c.submit}
              </button>

              <p className="text-xs text-muted leading-relaxed" aria-live="polite">
                {err ? (
                  <span className="text-bone-dim">
                    {err === "email" ? c.errEmail : err === "name" ? c.errName : err === "rate" ? c.errRate : c.errBackend}
                    {err !== "email" && err !== "name" && err !== "rate" && (
                      <>
                        {" "}
                        <a href={`mailto:${EMAIL}`} className="text-accent-text hover:underline">
                          {EMAIL}
                        </a>
                        .
                      </>
                    )}
                  </span>
                ) : (
                  c.privacy
                )}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const input = (bad: boolean) =>
  `w-full rounded-full border bg-ink px-5 py-2.5 text-sm text-bone placeholder:text-muted outline-none transition-colors focus:border-accent ${
    bad ? "border-mark" : "border-graphite-2 hover:border-graphite"
  }`;

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
