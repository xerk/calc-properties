"use client";

import { type Property, type Finances, type PlanType, fmt, fmtK, pct } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  plan: PlanType;
  isSelected: boolean;
  onSelect: (id: number) => void;
  cheapestCustom: number;
  cheapestStd: number;
  finances: Finances;
  privacyMode: boolean;
}

function mask(value: string, privacyMode: boolean): string {
  return privacyMode ? "•••••" : value;
}

function InfoTip({ children, tip }: { children: React.ReactNode; tip: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help border-b border-dotted border-muted-foreground/40">
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent>{tip}</TooltipContent>
    </Tooltip>
  );
}

export function PropertyCard({
  property: p,
  plan,
  isSelected,
  onSelect,
  cheapestCustom,
  cheapestStd,
  finances,
  privacyMode,
}: PropertyCardProps) {
  const final = plan === "custom" ? p.customFinal : p.standardFinal;
  const duration = plan === "custom" ? p.customDuration : p.standardDuration;
  const installments = plan === "custom" ? p.customInstallments : p.standardInstallments;
  const discount = plan === "custom" ? p.customDiscount : p.standardDiscount;
  const discountPct = discount / p.unitPrice;
  const pricePerSqm = final / p.bua;
  const cheapest = plan === "custom" ? cheapestCustom : cheapestStd;
  const isCheapest = pricePerSqm <= cheapest;

  const downPayment = plan === "custom" ? p.downPaymentCustom : p.downPaymentStd;
  const quarterly = plan === "custom" ? p.quarterlyCustom : (p.quarterlyStd || 0);
  const monthly = p.monthlyStd || 0;
  const annualBump = p.annualBumpStd || 0;

  let avgMonthly: number;
  if (plan === "custom") {
    avgMonthly = quarterly / 3;
  } else if (monthly > 0 && annualBump > 0) {
    avgMonthly = (final - downPayment) / (p.standardDuration * 12);
  } else if (quarterly > 0) {
    avgMonthly = quarterly / 3;
  } else {
    avgMonthly = (final - downPayment) / (p.standardDuration * 12);
  }

  const canAffordDown = finances.balance >= downPayment + p.maintenanceAmount;
  const canAffordMonthly = finances.maxMonthly >= avgMonthly;
  const canAffordWorst = finances.worstMonthly >= avgMonthly;

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "relative cursor-pointer overflow-visible transition-all duration-300 hover:shadow-md",
          isSelected
            ? "ring-2 ring-primary border-primary"
            : "hover:border-primary/40"
        )}
        onClick={() => onSelect(p.id)}
      >
        {isCheapest && (
          <div className="absolute -top-2.5 left-4 z-10">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Best Value /sqm
            </Badge>
          </div>
        )}

        <CardContent className="space-y-4 p-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  {p.project}
                </h3>
                {p.finished && (
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    Finished
                  </Badge>
                )}
                {!p.finished && (
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                    Core &amp; Shell
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {p.type} · <InfoTip tip="Built-Up Area — total usable floor space">{p.bua} sqm</InfoTip> · {p.location}
              </p>
            </div>
            <div className="text-right">
              <InfoTip tip="Net Present Value — the true economic cost accounting for time value of money">
                <p className="text-xs text-muted-foreground">NPV</p>
              </InfoTip>
              <p className="font-mono text-sm font-semibold text-foreground">
                {mask(fmtK(p.npv), privacyMode)}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Price Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">List Price</p>
              <p className="font-mono text-sm text-foreground">{mask(fmtK(p.unitPrice), privacyMode)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Final Price</p>
              <p className="font-mono text-sm font-semibold text-primary">{mask(fmtK(final), privacyMode)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Discount</p>
              <p className="font-mono text-sm text-emerald-400">{pct(discountPct)}</p>
            </div>
            <div>
              <InfoTip tip="Price per square meter of built-up area">
                <p className="text-xs text-muted-foreground">Price/sqm</p>
              </InfoTip>
              <p className="font-mono text-sm font-semibold text-foreground">
                {mask(fmt(Math.round(pricePerSqm)), privacyMode)}
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-2 rounded-lg bg-muted/50 p-3">
            <div className="flex justify-between text-xs">
              <InfoTip tip="Initial payment required at contract signing">
                <span className="text-muted-foreground">Down Payment</span>
              </InfoTip>
              <span className="font-mono font-medium text-foreground">{mask(fmtK(downPayment), privacyMode)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                {plan === "custom" ? "Quarterly" : monthly > 0 ? "Monthly" : "Quarterly"}
              </span>
              <span className="font-mono font-medium text-foreground">
                {mask(
                  plan === "custom"
                    ? fmtK(quarterly)
                    : monthly > 0
                      ? fmtK(monthly)
                      : fmtK(quarterly),
                  privacyMode
                )}
              </span>
            </div>
            {plan === "standard" && annualBump > 0 && (
              <div className="flex justify-between text-xs">
                <InfoTip tip="Annual increase added to your installments each year">
                  <span className="text-muted-foreground">Annual Bump</span>
                </InfoTip>
                <span className="font-mono font-medium text-foreground">{mask(fmtK(annualBump), privacyMode)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Avg Monthly</span>
              <span className="font-mono font-semibold text-foreground">~{mask(fmtK(Math.round(avgMonthly)), privacyMode)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-mono text-foreground">{duration}yr · {installments} payments</span>
            </div>
            <div className="flex justify-between text-xs">
              <InfoTip tip="Annual maintenance fee charged by the developer for common areas and facilities">
                <span className="text-muted-foreground">Maintenance ({p.maintenancePct}%)</span>
              </InfoTip>
              <span className="font-mono text-foreground">{mask(fmtK(p.maintenanceAmount), privacyMode)}</span>
            </div>
          </div>

          {/* Affordability — hidden in privacy mode */}
          {!privacyMode && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Affordability Check</p>
              <div className="flex items-center gap-2 text-xs">
                <span className={cn("h-2 w-2 rounded-full", canAffordDown ? "bg-emerald-400" : "bg-destructive")} />
                <span className="text-muted-foreground">Down + Maintenance</span>
                <span className="ml-auto font-mono text-foreground">
                  {fmtK(downPayment + p.maintenanceAmount)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={cn("h-2 w-2 rounded-full", canAffordMonthly ? "bg-emerald-400" : "bg-destructive")} />
                <span className="text-muted-foreground">Monthly @ max salary</span>
                <span className={cn("ml-auto font-mono", canAffordMonthly ? "text-foreground" : "text-destructive")}>
                  {Math.round((avgMonthly / finances.maxMonthly) * 100)}% of max
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={cn("h-2 w-2 rounded-full", canAffordWorst ? "bg-emerald-400" : "bg-amber-400")} />
                <span className="text-muted-foreground">Monthly @ worst case</span>
                <span className={cn("ml-auto font-mono", canAffordWorst ? "text-foreground" : "text-amber-400")}>
                  {Math.round((avgMonthly / finances.worstMonthly) * 100)}% of worst
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
