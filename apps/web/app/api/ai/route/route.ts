import { NextResponse } from "next/server";
import { createRoutingPlan } from "@/lib/ai/orchestrator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = typeof body?.input === "string" ? body.input.trim() : "";
    const language = typeof body?.language === "string" ? body.language : undefined;

    if (!input) {
      return NextResponse.json({ ok: false, error: "Input is required" }, { status: 400 });
    }

    if (input.length > 12000) {
      return NextResponse.json({ ok: false, error: "Input is too long" }, { status: 413 });
    }

    const plan = createRoutingPlan({ input, language });

    return NextResponse.json({
      ok: true,
      orchestrator: plan.orchestrator.id,
      parallel: plan.parallel,
      agents: plan.agents.map((agent) => ({
        id: agent.id,
        name: agent.name,
        team: agent.team,
      })),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
