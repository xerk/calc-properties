"use client";

import { type Property, fmtK } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface NpvComparisonChartProps {
  properties: Property[];
}

export function NpvComparisonChart({ properties }: NpvComparisonChartProps) {
  if (properties.length === 0) return null;

  const sorted = [...properties].sort((a, b) => a.npv - b.npv);
  const maxNpv = Math.max(...properties.map((x) => x.npv));
  const minNpv = Math.min(...properties.map((x) => x.npv));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">NPV (True Economic Cost)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.map((p) => {
          const percentage = (p.npv / maxNpv) * 100;
          const isCheapest = p.npv === minNpv;
          return (
            <div key={p.id} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {p.project} {p.type} ({p.bua}m²)
                </span>
                <span className="font-mono text-foreground">
                  {fmtK(p.npv)}
                  <span className="ml-1 text-muted-foreground">
                    ({fmtK(Math.round(p.npv / p.bua))}/sqm)
                  </span>
                </span>
              </div>
              <Progress
                value={percentage}
                className={cn("h-2", isCheapest && "[&>[data-slot=progress-indicator]]:bg-emerald-500")}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
