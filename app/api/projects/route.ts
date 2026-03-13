import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allProjects = await db.select().from(projects).orderBy(projects.name);
    return NextResponse.json(allProjects);
  } catch (error) {
    console.error("GET projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [newProject] = await db
      .insert(projects)
      .values({
        name: body.name,
        location: body.location,
        parent: body.parent,
        latitude: body.latitude,
        longitude: body.longitude,
        description: body.description,
        mapX: body.mapX,
        mapY: body.mapY,
        mapColor: body.mapColor,
      })
      .returning();
    return NextResponse.json(newProject);
  } catch (error) {
    console.error("POST projects error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.delete(projects).where(eq(projects.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE projects error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
