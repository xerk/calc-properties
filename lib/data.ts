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
