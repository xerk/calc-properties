import { db } from "@/lib/db";
import { properties, projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Property type that includes project info for the frontend
export interface PropertyWithProject {
  id: number;
  project: string;
  type: string;
  bua: number;
  location: string;
  parent: string;
  finished: boolean;
  startDate: string;
  maintenancePct: number;
  unitPrice: number;
  standardDiscount: number;
  standardFinal: number;
  standardInstallments: number;
  standardDuration: number;
  customDiscount: number;
  customFinal: number;
  customInstallments: number;
  customDuration: number;
  npv: number;
  maintenanceAmount: number;
  downPaymentStd: number;
  monthlyStd?: number;
  quarterlyStd?: number;
  annualBumpStd?: number;
  downPaymentCustom: number;
  quarterlyCustom: number;
}

export async function GET() {
  try {
    // Join properties with projects to get full property info
    const result = await db
      .select({
        property: properties,
        project: projects,
      })
      .from(properties)
      .leftJoin(projects, eq(properties.projectId, projects.id))
      .orderBy(properties.id);

    // Transform to the format expected by the frontend
    const propertiesWithProject: PropertyWithProject[] = result.map(({ property, project }) => ({
      id: property.id,
      project: project?.name ?? "Unknown",
      type: property.type,
      bua: property.bua,
      location: project?.location ?? "Unknown",
      parent: project?.parent ?? "",
      finished: property.finished ?? false,
      startDate: property.startDate ?? "",
      maintenancePct: property.maintenancePct,
      unitPrice: property.unitPrice,
      standardDiscount: property.standardDiscount ?? 0,
      standardFinal: property.standardFinal ?? 0,
      standardInstallments: property.standardInstallments ?? 0,
      standardDuration: property.standardDuration ?? 0,
      customDiscount: property.customDiscount ?? 0,
      customFinal: property.customFinal ?? 0,
      customInstallments: property.customInstallments ?? 0,
      customDuration: property.customDuration ?? 0,
      npv: property.npv ?? 0,
      maintenanceAmount: property.maintenanceAmount ?? 0,
      downPaymentStd: property.downPaymentStd ?? 0,
      monthlyStd: property.monthlyStd ?? undefined,
      quarterlyStd: property.quarterlyStd ?? undefined,
      annualBumpStd: property.annualBumpStd ?? undefined,
      downPaymentCustom: property.downPaymentCustom ?? 0,
      quarterlyCustom: property.quarterlyCustom ?? 0,
    }));

    return NextResponse.json(propertiesWithProject);
  } catch (error) {
    console.error("GET properties error:", error);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [newProperty] = await db
      .insert(properties)
      .values({
        projectId: body.projectId,
        type: body.type,
        bua: body.bua,
        finished: body.finished,
        startDate: body.startDate,
        maintenancePct: body.maintenancePct,
        unitPrice: body.unitPrice,
        standardDiscount: body.standardDiscount,
        standardFinal: body.standardFinal,
        standardInstallments: body.standardInstallments,
        standardDuration: body.standardDuration,
        downPaymentStd: body.downPaymentStd,
        monthlyStd: body.monthlyStd,
        quarterlyStd: body.quarterlyStd,
        annualBumpStd: body.annualBumpStd,
        customDiscount: body.customDiscount,
        customFinal: body.customFinal,
        customInstallments: body.customInstallments,
        customDuration: body.customDuration,
        downPaymentCustom: body.downPaymentCustom,
        quarterlyCustom: body.quarterlyCustom,
        npv: body.npv,
        maintenanceAmount: body.maintenanceAmount,
      })
      .returning();
    return NextResponse.json(newProperty);
  } catch (error) {
    console.error("POST properties error:", error);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.delete(properties).where(eq(properties.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE properties error:", error);
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 });
  }
}
