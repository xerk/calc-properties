"use client";

import { type Property, type Finances, type PlanType, fmt, fmtK, pct, getRentalYield, isCoreAndShell } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Info } from "lucide-react";
import { PaymentScheduleSidebar } from "@/components/features/properties/payment-schedule-sidebar";
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
  finishingPricePerSqm: number;
}

function mask(value: string, privacyMode: boolean): string {
  return privacyMode ? "•••••" : value;
}

function InfoTip({ children, tip }: { children: React.ReactNode; tip: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="relative z-30 cursor-help border-b border-dotted border-muted-foreground/40">
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
  finishingPricePerSqm,
}: PropertyCardProps) {
  const needsFinishing = isCoreAndShell(p.project);
  const finishingCostTotal = needsFinishing ? finishingPricePerSqm * p.bua : 0;

  const finalWithoutFinishing = plan === "custom" ? p.customFinal : p.standardFinal;
  const final = finalWithoutFinishing + finishingCostTotal;

  const duration = plan === "custom" ? p.customDuration : p.standardDuration;
  const installments = plan === "custom" ? p.customInstallments : p.standardInstallments;
  const discount = plan === "custom" ? p.customDiscount : p.standardDiscount;
  const discountPct = discount / p.unitPrice;
  const pricePerSqm = final / p.bua;
  const cheapest = plan === "custom" ? cheapestCustom : cheapestStd;
  const isCheapest = pricePerSqm <= cheapest;

  const rentalYield = getRentalYield(final, p.bua);

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

  const canAffordDown = finances.balance >= downPayment;
  const canAffordMaintenance = finances.balance >= p.maintenanceAmount;
  const canAffordMonthly = finances.maxMonthly >= avgMonthly;
  const canAffordWorst = finances.worstMonthly >= avgMonthly;

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "relative z-10 flex h-full flex-col overflow-visible transition-all duration-300",
          isSelected 
            ? "ring-2 ring-primary border-primary/50 shadow-lg" 
            : "hover:border-primary/30 border-border/50 shadow-sm"
        )}
      >
        {isCheapest && (
          <div className="absolute -top-3 left-4 z-50 pointer-events-none">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-md opacity-40 animate-pulse" />
              <Badge className="relative bg-emerald-500 text-white border-none text-[9px] font-black uppercase tracking-[0.1em] px-3 py-1 shadow-xl">
                Best Value /sqm
              </Badge>
            </div>
          </div>
        )}

        {/* Clickable Overlay */}
        <button
          onClick={() => onSelect(p.id)}
          className="absolute inset-0 z-10 size-full cursor-pointer outline-none"
          aria-label={`Select ${p.project}`}
        />

        <CardContent className="flex flex-grow flex-col space-y-4 p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-black tracking-tight text-foreground">
                  {p.project} {p.type}
                </h3>
                {p.finished && (
                  <Badge variant="outline" className="h-4 border-emerald-500/30 text-emerald-400 text-[9px] uppercase font-bold px-1.5">
                    Finished
                  </Badge>
                )}
                {!p.finished && (
                  <Badge variant="outline" className="h-4 border-amber-500/30 text-amber-400 text-[9px] uppercase font-bold px-1.5">
                    Core & Shell
                  </Badge>
                )}
              </div>
              <p className="text-[10px] items-center flex gap-1.5 font-bold uppercase tracking-widest text-muted-foreground/50">
                {p.project} <span className="size-1 rounded-full bg-border" /> {p.bua} sqm <span className="size-1 rounded-full bg-border" /> {p.location}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <InfoTip tip="Net Present Value — the true economic cost accounting for time value of money">
                <p className="text-[10px] uppercase font-bold tracking-tighter text-muted-foreground/40">NPV</p>
              </InfoTip>
              <p className="font-mono text-sm font-bold text-foreground">
                {fmtK(p.npv)}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Price Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">List Price</p>
              <p className="font-mono text-sm text-foreground">{fmtK(p.unitPrice)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Final Price</p>
              <p className="font-mono text-sm font-semibold text-primary">{fmtK(final)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Discount</p>
              <p className="font-mono text-sm text-emerald-400">{pct(discountPct)}</p>
            </div>
            <div>
              <InfoTip tip="Price per square meter of built-up area (includes finishing cost if applied)">
                <p className="text-xs text-muted-foreground">Price/sqm</p>
              </InfoTip>
              <p className="font-mono text-sm font-semibold text-foreground">
                {fmt(Math.round(pricePerSqm))}
              </p>
            </div>
          </div>

          {finishingCostTotal > 0 && (
            <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-2 flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Info className="size-3 text-amber-400" />
                <span className="text-[10px] font-medium text-amber-400 uppercase tracking-tight">Finishing Est.</span>
              </div>
              <span className="font-mono text-xs text-foreground font-semibold">+{fmtK(finishingCostTotal)}</span>
            </div>
          )}

          {/* Payment Details */}
          <div className="space-y-2 rounded-lg bg-muted/50 p-3">
            <div className="flex justify-between text-xs">
              <InfoTip tip="Initial payment required at contract signing">
                <span className="text-muted-foreground">Down Payment</span>
              </InfoTip>
              <span className="font-mono font-medium text-foreground">{fmtK(downPayment)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                {plan === "custom" ? "Quarterly" : monthly > 0 ? "Monthly" : "Quarterly"}
              </span>
              <span className="font-mono font-medium text-foreground">
                {plan === "custom"
                  ? fmtK(quarterly)
                  : monthly > 0
                    ? fmtK(monthly)
                    : fmtK(quarterly)}
              </span>
            </div>
            {plan === "standard" && annualBump > 0 && (
              <div className="flex justify-between text-xs">
                <InfoTip tip="Annual increase added to your installments each year">
                  <span className="text-muted-foreground">Annual Bump</span>
                </InfoTip>
                <span className="font-mono font-medium text-foreground">{fmtK(annualBump)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Avg Monthly</span>
              <span className="font-mono font-semibold text-foreground">~{fmtK(Math.round(avgMonthly))}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-mono text-foreground">{duration}yr · {installments} payments</span>
            </div>
            <div className="flex justify-between text-xs">
              <InfoTip tip="Annual maintenance fee charged by the developer for common areas and facilities">
                <span className="text-muted-foreground">Maintenance ({p.maintenancePct}%)</span>
              </InfoTip>
              <span className="font-mono text-foreground">{fmtK(p.maintenanceAmount)}</span>
            </div>
          </div>

          {/* Affordability — hidden in privacy mode */}
          {!privacyMode && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Affordability Check</p>
              <div className="flex items-center gap-2 text-xs">
                <span className={cn("h-2 w-2 rounded-full", canAffordDown ? "bg-emerald-400" : "bg-destructive")} />
                <span className="text-muted-foreground">Down Payment</span>
                <span className="ml-auto font-mono text-foreground">
                  {fmtK(downPayment)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={cn("h-2 w-2 rounded-full", canAffordMaintenance ? "bg-emerald-400" : "bg-destructive")} />
                <span className="text-muted-foreground">Maintenance</span>
                <span className="ml-auto font-mono text-foreground">
                  {fmtK(p.maintenanceAmount)}
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
        <CardFooter className="relative z-20 px-4 py-3 border-t border-border/50">
          <div className="w-full flex items-center justify-between py-1">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-primary">
                <TrendingUp className="size-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Rental Yield</span>
              </div>
              <p className="font-mono text-sm font-bold text-foreground">
                {pct(rentalYield)} 
                <span className="ml-1.5 text-[10px] font-normal text-muted-foreground uppercase">yr / net</span>
              </p>
            </div>
            
            <PaymentScheduleSidebar property={p} plan={plan}>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Calendar className="size-4 text-muted-foreground" />
              </Button>
            </PaymentScheduleSidebar>
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
