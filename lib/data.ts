export interface Property {
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

export interface Finances {
  balance: number;
  maxMonthly: number;
  worstMonthly: number;
}

export type PlanType = "custom" | "standard";
export type SizeFilter = "all" | "212" | "239";

export const properties: Property[] = [
  {
    id: 1,
    project: "TALALA",
    type: "S.Villa B",
    bua: 240,
    location: "New Heliopolis",
    parent: "TALALA",
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
    id: 2,
    project: "Club Views",
    type: "S.Villa",
    bua: 212,
    location: "Sarai, New Cairo",
    parent: "Origami Golf / Taj City",
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
    id: 3,
    project: "Club Views",
    type: "Villa",
    bua: 239,
    location: "Sarai, New Cairo",
    parent: "Origami Golf / Taj City",
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
    id: 4,
    project: "Elm Tree Park",
    type: "S.Villa",
    bua: 212,
    location: "Sarai, New Cairo",
    parent: "Sarai",
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
    id: 5,
    project: "TALALA",
    type: "S.Villa A",
    bua: 215,
    location: "New Heliopolis",
    parent: "TALALA",
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
    id: 6,
    project: "Elm Tree Park",
    type: "Villa",
    bua: 239,
    location: "Sarai, New Cairo",
    parent: "Sarai",
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
    id: 7,
    project: "TALALA",
    type: "S.Villa",
    bua: 208,
    location: "New Heliopolis",
    parent: "TALALA",
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

/** Format number with locale string, e.g. 1,234,567 */
export function fmt(v: number) {
  return new Intl.NumberFormat("en-US").format(v);
}

/** Format number in compact form: 8.76M, 377K, etc. */
export function fmtK(v: number) {
  if (v >= 1000000) return (v / 1000000).toFixed(2) + "M";
  if (v >= 1000) return (v / 1000).toFixed(0) + "k";
  return v.toString();
}

/** Format decimal as percentage string, e.g. 0.21 → "21.0%" */
export function pct(v: number) {
  return (v * 100).toFixed(1) + "%";
}

export function getRentalYield(totalPrice: number, bua: number): number {
  // Estimated annual rent based on area quality and size
  // Simple conservative model: ~5-7% of total price annually
  const annualRent = totalPrice * 0.055; 
  return annualRent / totalPrice;
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat("en-US").format(val);
}

export function parseNumber(val: string): number {
  const clean = val.replace(/,/g, "").toLowerCase();
  if (clean.endsWith("k")) return parseFloat(clean) * 1000;
  if (clean.endsWith("m")) return parseFloat(clean) * 1000000;
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function isCoreAndShell(project: string): boolean {
  return !["TALALA"].includes(project);
}
