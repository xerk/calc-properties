"use client";

import { type PlanType, properties, fmt } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PriceComparisonChartProps {
  plan: PlanType;
}

export function PriceComparisonChart({ plan }: PriceComparisonChartProps) {
  const getPrice = (p: (typeof properties)[number]) =>
    (plan === "custom" ? p.customFinal : p.standardFinal) / p.bua;

  const sorted = [...properties].sort((a, b) => getPrice(a) - getPrice(b));
  const maxPrice = Math.max(...properties.map(getPrice));
  const minPrice = Math.min(...properties.map(getPrice));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          Price/sqm Comparison ({plan === "custom" ? "Customized" : "Standard"})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.map((p) => {
          const price = getPrice(p);
          const percentage = (price / maxPrice) * 100;
          const isCheapest = price === minPrice;
          return (
            <div key={p.id} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {p.project} {p.type} ({p.bua}m²)
                </span>
                <span className="font-mono text-foreground">
                  {fmt(Math.round(price))} /sqm
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
