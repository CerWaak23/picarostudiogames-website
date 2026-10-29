"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { CONTACT_EMAIL } from "@/lib/fitnessEraLegal";

/**
 * Lista de espera del playtesting. Manda a /api/playtesting, que guarda en Unity Gaming Services.
 * Formas y colores del manual: campos y botones `rounded-full`, etiquetas en mono, todo por token
 * (ver DESIGN.md). El naranja del juego no entra acá: la acción es del estudio.
 */

const PLATFORMS = ["android", "ios"] as const;
type Platform = (typeof PLATFORMS)[number];

const copy = {
  es: {
    email: "Correo",
    emailHint: "tu@correo.cl",
    name: "Nombre (opcional)",
    nameHint: "Como quieras que te digamos",
    platform: "¿Dónde lo vas a probar? (opcional)",
    android: "Android",
    ios: "iOS",
    submit: "Anotarme",
    sending: "Anotando",
    note: "Solo para avisarte cuando abra el playtesting. No lo compartimos con nadie y lo borramos si nos lo pides.",
    policy: "Cómo guardamos esto",
    okTitle: "Estás en la lista",
    okText: "Te escribimos a ese correo cuando haya algo que probar. No antes.",
    againTitle: "Ya estabas en la lista",
    againText: "Anotamos los cambios. Sigues primero en la fila.",
    errEmail: "Ese correo no se ve bien. Revísalo.",
    errRate: "Muchos intentos seguidos. Espera un par de minutos.",
    errBackend: "No se pudo guardar. Intenta de nuevo en un rato, o escríbenos a",
  },
  en: {
    email: "Email",
    emailHint: "you@email.com",
    name: "Name (optional)",
    nameHint: "Whatever you want to be called",
    platform: "Where will you play it? (optional)",
    android: "Android",
    ios: "iOS",
    submit: "Sign me up",
    sending: "Signing up",
    note: "Only to tell you when playtesting opens. We don't share it with anyone and we delete it if you ask.",
    policy: "How we keep this",
    okTitle: "You're on the list",
    okText: "We'll write to that address when there's something to play. Not before.",
    againTitle: "You were already on the list",
    againText: "We saved the changes. You keep your place in line.",
    errEmail: "That email doesn't look right. Check it.",
    errRate: "Too many tries in a row. Wait a couple of minutes.",
    errBackend: "Couldn't save it. Try again in a bit, or write to us at",
  },
};

type State = { kind: "idle" } | { kind: "sending" } | { kind: "ok"; again: boolean } | { kind: "error"; code: string };

export default function PlaytestingForm() {
  const { lang } = useLang();
  const c = copy[lang];
  const id = useId();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [platform, setPlatform] = useState<Platform | "">("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state.kind === "sending") return;
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/playtesting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, platform, website, lang }),
      });
      const body = (await res.json().catch(() => null)) as { ok?: boolean; again?: boolean; code?: string } | null;
      if (res.ok && body?.ok) setState({ kind: "ok", again: body.again === true });
      else setState({ kind: "error", code: body?.code ?? "backend" });
    } catch {
      setState({ kind: "error", code: "backend" });
    }
  }

  if (state.kind === "ok") {
    return (
      <div className="w-full md:max-w-sm border border-accent/40 bg-ink-2 px-6 py-5" role="status">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-text mb-2">
          {state.again ? c.againTitle : c.okTitle}
        </p>
        <p className="text-sm text-bone-dim leading-relaxed">{state.again ? c.againText : c.okText}</p>
      </div>
    );
  }

  const sending = state.kind === "sending";
  const badEmail = state.kind === "error" && state.code === "email";

  return (
    <form onSubmit={submit} noValidate className="w-full md:max-w-sm flex flex-col gap-4">
      <Field id={`${id}-email`} label={c.email}>
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          required
          autoComplete="email"
          maxLength={120}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={c.emailHint}
          aria-invalid={badEmail || undefined}
          className={input(badEmail)}
        />
      </Field>

      <Field id={`${id}-name`} label={c.name}>
        <input
          id={`${id}-name`}
          type="text"
          name="name"
          autoComplete="name"
          maxLength={40}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={c.nameHint}
          className={input(false)}
        />
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted mb-2">{c.platform}</legend>
        <div className="flex gap-2">
          {PLATFORMS.map((p) => {
            const on = platform === p;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={on}
                onClick={() => setPlatform(on ? "" : p)}
                className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
                  on
                    ? "border-accent bg-accent-fill text-accent-on"
                    : "border-graphite-2 text-bone-dim hover:border-accent/50 hover:text-bone"
                }`}
              >
                {c[p]}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Campo trampa: invisible para una persona, irresistible para un robot. */}
      <div aria-hidden className="h-0 w-0 overflow-hidden">
        <label htmlFor={`${id}-website`}>No llenar</label>
        <input id={`${id}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="rounded-full bg-accent-fill text-accent-on font-mono font-bold text-xs tracking-[0.18em] uppercase px-6 py-3 transition-colors hover:bg-bone disabled:opacity-60 disabled:hover:bg-accent-fill"
      >
        {sending ? `${c.sending}…` : c.submit}
      </button>

      <p className="text-xs text-muted leading-relaxed" aria-live="polite">
        {state.kind === "error" ? (
          <span className="text-bone-dim">
            {state.code === "email" ? c.errEmail : state.code === "rate" ? c.errRate : c.errBackend}
            {state.code !== "email" && state.code !== "rate" && (
              <>
                {" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-text hover:underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </>
            )}
          </span>
        ) : (
          <>
            {c.note}{" "}
            <Link href="/games/fitness-era/privacidad#lista-de-espera" className="text-bone-dim underline underline-offset-2 hover:text-accent-text transition-colors">
              {c.policy}
            </Link>
          </>
        )}
      </p>
    </form>
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
