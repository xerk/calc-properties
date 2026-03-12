"use client";

import { type Property, type PlanType, fmt, fmtK, pct } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { properties } from "@/lib/data";

interface ComparisonTableProps {
  selected: number[];
  plan: PlanType;
}

const rows: { label: string; fn: (p: Property, plan: PlanType) => string | number }[] = [
  { label: "BUA", fn: (p) => `${p.bua} sqm` },
  { label: "Finished", fn: (p) => (p.finished ? "✓ Yes" : "✗ Core & Shell") },
  {
    label: "Final Price",
    fn: (p, plan) => fmt(plan === "custom" ? p.customFinal : p.standardFinal),
  },
  {
    label: "Price/sqm",
    fn: (p, plan) =>
      fmt(Math.round((plan === "custom" ? p.customFinal : p.standardFinal) / p.bua)),
  },
  {
    label: "Discount",
    fn: (p, plan) =>
      pct((plan === "custom" ? p.customDiscount : p.standardDiscount) / p.unitPrice),
  },
  { label: "NPV", fn: (p) => fmt(p.npv) },
  { label: "NPV/sqm", fn: (p) => fmt(Math.round(p.npv / p.bua)) },
  {
    label: "Duration",
    fn: (p, plan) => `${plan === "custom" ? p.customDuration : p.standardDuration}yr`,
  },
  {
    label: "Installments",
    fn: (p, plan) => (plan === "custom" ? p.customInstallments : p.standardInstallments),
  },
  { label: "Maintenance %", fn: (p) => `${p.maintenancePct}%` },
  { label: "Maintenance EGP", fn: (p) => fmtK(p.maintenanceAmount) },
  { label: "Start Date", fn: (p) => p.startDate },
];

export function ComparisonTable({ selected, plan }: ComparisonTableProps) {
  const items = properties.filter((p) => selected.includes(p.id));
  if (items.length < 2) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          Side-by-Side Comparison ({items.length} selected)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">Metric</TableHead>
              {items.map((p) => (
                <TableHead key={p.id} className="text-right font-semibold text-foreground">
                  {p.project}
                  <br />
                  <span className="font-normal text-muted-foreground">
                    {p.type} {p.bua}m²
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.label}>
                <TableCell className="text-muted-foreground">{r.label}</TableCell>
                {items.map((p) => (
                  <TableCell key={p.id} className="text-right font-mono text-foreground">
                    {r.fn(p, plan)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
