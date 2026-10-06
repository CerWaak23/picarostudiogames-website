import { NextResponse } from "next/server";
import { runAdmin } from "@/lib/run";

/** Descarga los datos de un reporte (puntos del cuerpo, nunca imagen). Solo owners. */
export async function GET(_req: Request, ctx: { params: Promise<{ project: string; id: string }> }) {
  const params = await ctx.params;
  if (!/^r[0-9]{6,20}$/.test(params.id)) return new NextResponse("Reporte inválido", { status: 400 });
  const r = await runAdmin<{ data?: string }>(params.project, "reports.data", { id: params.id }, { need: "owner", target: params.id });
  if (!r.ok || !r.data?.data) return new NextResponse(r.message, { status: r.ok ? 404 : 403 });
  return new NextResponse(r.data.data, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${params.id}.json"`,
    },
  });
}
