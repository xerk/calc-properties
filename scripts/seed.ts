import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema });

// Project data with map positions for the stylized map
const projectsData: schema.NewProject[] = [
  {
    name: "TALALA",
    location: "New Heliopolis",
    parent: "TALALA",
    mapX: "75%",
    mapY: "45%",
    mapColor: "bg-emerald-400",
  },
  {
    name: "Club Views",
    location: "Sarai, New Cairo",
    parent: "Origami Golf / Taj City",
    mapX: "45%",
    mapY: "65%",
    mapColor: "bg-blue-400",
  },
  {
    name: "Elm Tree Park",
    location: "Sarai, New Cairo",
    parent: "Sarai",
    mapX: "42%",
    mapY: "62%",
    mapColor: "bg-amber-400",
  },
];

// Properties data from lib/data.ts
const propertiesData = [
  {
    projectName: "TALALA",
    type: "S.Villa B",
    bua: 240,
    finished: true,
    startDate: "Feb 2026",
    maintenancePct: 6.4,
    unitPrice: 24330551,
    standardDiscount: 5095650,
    standardFinal: 19234901,
    standardInstallments: 144,
    standardDuration: 12,
    customDiscount: 8308934,
    customFinal: 16021617,
    customInstallments: 40,
    customDuration: 10,
    npv: 8758997,
    maintenanceAmount: 1557155,
    downPaymentStd: 1264520,
    monthlyStd: 21345,
    annualBumpStd: 1264520,
    downPaymentCustom: 1300000,
    quarterlyCustom: 377477,
  },
  {
    projectName: "Club Views",
    type: "S.Villa",
    bua: 212,
    finished: false,
    startDate: "Oct 2025",
    maintenancePct: 8.0,
    unitPrice: 17200000,
    standardDiscount: 1290000,
    standardFinal: 15910000,
    standardInstallments: 48,
    standardDuration: 12,
    customDiscount: 3662854,
    customFinal: 13537146,
    customInstallments: 36,
    customDuration: 9,
    npv: 8600000,
    maintenanceAmount: 1376000,
    downPaymentStd: 1290000,
    quarterlyStd: 311064,
    downPaymentCustom: 1300000,
    quarterlyCustom: 349633,
  },
  {
    projectName: "Club Views",
    type: "Villa",
    bua: 239,
    finished: false,
    startDate: "Oct 2025",
    maintenancePct: 8.0,
    unitPrice: 20200000,
    standardDiscount: 1515000,
    standardFinal: 18685000,
    standardInstallments: 48,
    standardDuration: 12,
    customDiscount: 3516560,
    customFinal: 16683440,
    customInstallments: 40,
    customDuration: 10,
    npv: 10100000,
    maintenanceAmount: 1616000,
    downPaymentStd: 1515000,
    quarterlyStd: 365319,
    downPaymentCustom: 1520000,
    quarterlyCustom: 388806,
  },
  {
    projectName: "Elm Tree Park",
    type: "S.Villa",
    bua: 212,
    finished: false,
    startDate: "Oct 2025",
    maintenancePct: 8.0,
    unitPrice: 18102451,
    standardDiscount: 1357684,
    standardFinal: 16744767,
    standardInstallments: 144,
    standardDuration: 12,
    customDiscount: 3848601,
    customFinal: 14253850,
    customInstallments: 36,
    customDuration: 9,
    npv: 9051228,
    maintenanceAmount: 1448196,
    downPaymentStd: 1357684,
    monthlyStd: 107602,
    downPaymentCustom: 1400000,
    quarterlyCustom: 367253,
  },
  {
    projectName: "TALALA",
    type: "S.Villa A",
    bua: 215,
    finished: true,
    startDate: "Feb 2026",
    maintenancePct: 6.4,
    unitPrice: 20935888,
    standardDiscount: 4384692,
    standardFinal: 16551196,
    standardInstallments: 144,
    standardDuration: 12,
    customDiscount: 7228885,
    customFinal: 13707003,
    customInstallments: 40,
    customDuration: 10,
    npv: 7536919,
    maintenanceAmount: 1339897,
    downPaymentStd: 1088091,
    monthlyStd: 18367,
    annualBumpStd: 1088091,
    downPaymentCustom: 1200000,
    quarterlyCustom: 320692,
  },
  {
    projectName: "Elm Tree Park",
    type: "Villa",
    bua: 239,
    finished: false,
    startDate: "Oct 2025",
    maintenancePct: 8.0,
    unitPrice: 21297770,
    standardDiscount: 1597333,
    standardFinal: 19700437,
    standardInstallments: 144,
    standardDuration: 12,
    customDiscount: 2817362,
    customFinal: 18480408,
    customInstallments: 44,
    customDuration: 11,
    npv: 10648888,
    maintenanceAmount: 1703822,
    downPaymentStd: 1597333,
    monthlyStd: 126595,
    downPaymentCustom: 1600000,
    quarterlyCustom: 392568,
  },
  {
    projectName: "TALALA",
    type: "S.Villa",
    bua: 208,
    finished: true,
    startDate: "May 2026",
    maintenancePct: 6.4,
    unitPrice: 28136654,
    standardDiscount: 5892778,
    standardFinal: 22243876,
    standardInstallments: 144,
    standardDuration: 12,
    customDiscount: 8562009,
    customFinal: 19574645,
    customInstallments: 44,
    customDuration: 11,
    npv: 10129194,
    maintenanceAmount: 1800746,
    downPaymentStd: 1462332,
    monthlyStd: 24684,
    annualBumpStd: 1462332,
    downPaymentCustom: 1500000,
    quarterlyCustom: 420341,
  },
];

async function seed() {
  console.log("Seeding database...");

  // Insert projects
  console.log("Inserting projects...");
  const insertedProjects: Map<string, number> = new Map();

  for (const project of projectsData) {
    const result = db
      .insert(schema.projects)
      .values(project)
      .onConflictDoNothing()
      .returning()
      .get();

    if (result) {
      insertedProjects.set(result.name, result.id);
      console.log(`  - Inserted project: ${result.name} (ID: ${result.id})`);
    } else {
      // Project already exists, fetch its ID
      const existing = db
        .select()
        .from(schema.projects)
        .where(eq(schema.projects.name, project.name))
        .get();
      if (existing) {
        insertedProjects.set(existing.name, existing.id);
        console.log(`  - Project already exists: ${existing.name} (ID: ${existing.id})`);
      }
    }
  }

  // Insert properties
  console.log("\nInserting properties...");
  for (const prop of propertiesData) {
    const projectId = insertedProjects.get(prop.projectName);
    if (!projectId) {
      console.error(`  - Error: Project ${prop.projectName} not found`);
      continue;
    }

    const { projectName, ...rest } = prop;
    const propertyData: schema.NewDbProperty = {
      ...rest,
      projectId,
    };

    db.insert(schema.properties).values(propertyData).run();
    console.log(`  - Inserted property: ${prop.projectName} ${prop.type} (${prop.bua} sqm)`);
  }

  console.log("\nSeeding complete!");
  console.log(`  - ${projectsData.length} projects`);
  console.log(`  - ${propertiesData.length} properties`);
}

seed().catch(console.error);
