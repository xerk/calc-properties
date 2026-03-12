import { db } from "@/lib/db";
import { scenarios } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allScenarios = await db.select().from(scenarios).orderBy(scenarios.createdAt);
    return NextResponse.json(allScenarios);
  } catch (error) {
    console.error("GET scenarios error:", error);
    return NextResponse.json({ error: "Failed to fetch scenarios" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [newScenario] = await db.insert(scenarios).values({
      name: body.name,
      balanceUSD: body.balanceUSD,
      maxSalaryUSD: body.maxSalaryUSD,
      worstSalaryUSD: body.worstSalaryUSD,
      exchangeRate: body.exchangeRate,
    }).returning();
    return NextResponse.json(newScenario);
  } catch (error) {
    console.error("POST scenarios error:", error);
    return NextResponse.json({ error: "Failed to save scenario" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    await db.delete(scenarios).where(eq(scenarios.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE scenarios error:", error);
    return NextResponse.json({ error: "Failed to delete scenario" }, { status: 500 });
  }
}
