"use client";

import { useState, useMemo } from "react";
import { type PlanType, type SizeFilter, properties, formatNumber, parseNumber } from "@/lib/data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, RotateCcw } from "lucide-react";
import { useExchangeRate } from "@/hooks/use-exchange-rate";
import { PropertyCard } from "@/components/features/properties/property-card";
import { ComparisonTable } from "@/components/features/properties/comparison-table";
import { PriceComparisonChart } from "@/components/features/properties/price-comparison-chart";
import { NpvComparisonChart } from "@/components/features/properties/npv-comparison-chart";
import { FinancialProfile } from "@/components/features/properties/financial-profile";

import { ScenarioManager } from "@/components/features/properties/scenario-manager";
import { PropertyMap } from "@/components/features/properties/property-map";
import { type Scenario } from "@/lib/db/schema";

export function PropertyAnalyzer() {
  const [plan, setPlan] = useState<PlanType>("custom");
  const [minArea, setMinArea] = useState<number>(0);
  const [maxArea, setMaxArea] = useState<number>(1000);
  const [selected, setSelected] = useState<number[]>([]);
  const [balanceUSD, setBalanceUSD] = useState(71300);
  const [maxSalaryUSD, setMaxSalaryUSD] = useState(10000);
  const [worstSalaryUSD, setWorstSalaryUSD] = useState(2300);
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>("all");
  const [privacyMode, setPrivacyMode] = useState(false);
  const [finishingPricePerSqm, setFinishingPricePerSqm] = useState(0);
  const [finishingInput, setFinishingInput] = useState("0");

  const { rate: exchangeRate, setRate: setExchangeRate, loading: rateLoading, error: rateError } = useExchangeRate();

  const handleLoadScenario = (s: Scenario) => {
    setBalanceUSD(s.balanceUSD);
    setMaxSalaryUSD(s.maxSalaryUSD);
    setWorstSalaryUSD(s.worstSalaryUSD);
    setFinishingPricePerSqm(0); // Reset finishing or keep current? Usually better to reset to sane default or let user adjust.
    setFinishingInput("0");
  };

  const handleFinishingChange = (val: string) => {
    if (/[\d.]+[km]$/i.test(val)) {
      const num = parseNumber(val);
      setFinishingInput(formatNumber(num));
      setFinishingPricePerSqm(num);
    } else {
      setFinishingInput(val);
      const num = parseNumber(val);
      if (!isNaN(num)) setFinishingPricePerSqm(num);
    }
  };

  const handleFinishingBlur = (val: string) => {
    const num = parseNumber(val);
    setFinishingPricePerSqm(num);
    setFinishingInput(formatNumber(num));
  };

  const finances = useMemo(
    () => ({
      balance: balanceUSD * exchangeRate,
      maxMonthly: maxSalaryUSD * exchangeRate,
      worstMonthly: worstSalaryUSD * exchangeRate,
    }),
    [balanceUSD, maxSalaryUSD, worstSalaryUSD, exchangeRate]
  );

  const cheapestCustom = Math.min(
    ...properties.map((p) => p.customFinal / p.bua)
  );
  const cheapestStd = Math.min(
    ...properties.map((p) => p.standardFinal / p.bua)
  );

  const filtered = properties.filter((p) => {
    const isSizeFilterMatch = sizeFilter === "all" ||
      (sizeFilter === "212" && p.bua <= 215) ||
      (sizeFilter === "239" && p.bua >= 239);

    const isAreaMatch = p.bua >= minArea && p.bua <= maxArea;

    return isSizeFilterMatch && isAreaMatch;
  });

  const toggleSelect = (id: number) => {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      {/* Header */}
      <div className="space-y-1">
        <h1
          style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}
          className="text-2xl font-bold text-foreground"
        >
          Property Investment Analyzer
        </h1>
        <p className="text-sm text-muted-foreground">
          Madinet Masr — TALALA · Club Views · Elm Tree Park — 6 units compared
        </p>
      </div>

      {/* Financial Profile & Contextual Actions */}
      <div className="w-full">
        <FinancialProfile
          balanceUSD={balanceUSD}
          maxSalaryUSD={maxSalaryUSD}
          worstSalaryUSD={worstSalaryUSD}
          exchangeRate={exchangeRate}
          finances={finances}
          privacyMode={privacyMode}
          rateLoading={rateLoading}
          rateError={rateError}
          onBalanceChange={setBalanceUSD}
          onMaxSalaryChange={setMaxSalaryUSD}
          onWorstSalaryChange={setWorstSalaryUSD}
          onPrivacyToggle={setPrivacyMode}
          renderActions={
            <div className="flex items-center gap-2">
              <ScenarioManager
                currentProfile={{
                  balanceUSD,
                  maxSalaryUSD,
                  worstSalaryUSD,
                  exchangeRate,
                }}
                onLoad={handleLoadScenario}
              />
              <PropertyMap />
            </div>
          }
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <Tabs
          value={plan}
          onValueChange={(v) => setPlan(v as PlanType)}
        >
          <TabsList>
            <TabsTrigger value="custom" className="gap-1.5">
              Customized Plan
              <span className="text-[10px] opacity-50">({properties.filter(p => p.customFinal / p.bua === cheapestCustom).length})</span>
            </TabsTrigger>
            <TabsTrigger value="standard" className="gap-1.5">
              Standard Plan
              <span className="text-[10px] opacity-50">({properties.filter(p => p.standardFinal / p.bua === cheapestStd).length})</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs
          value={sizeFilter}
          onValueChange={(v) => setSizeFilter(v as SizeFilter)}
        >
          <TabsList>
            <TabsTrigger value="all" className="gap-1.5">
              All Units
              <span className="text-[10px] opacity-50">({properties.length})</span>
            </TabsTrigger>
            <TabsTrigger value="212" className="gap-1.5">
              ~212 sqm
              <span className="text-[10px] opacity-50">({properties.filter(p => p.bua <= 215).length})</span>
            </TabsTrigger>
            <TabsTrigger value="239" className="gap-1.5">
              ~239+ sqm
              <span className="text-[10px] opacity-50">({properties.filter(p => p.bua >= 239).length})</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Finishing Cost Estimator */}
        <div className="flex items-center gap-2 rounded-md border border-border/50 bg-muted/30 px-3 py-1.5 shadow-sm">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
            Finishing Cost /sqm
          </label>
          <div className="flex items-center gap-2">
            <Input
              type={privacyMode ? "password" : "text"}
              value={finishingInput}
              onChange={(e) => handleFinishingChange(e.target.value)}
              onBlur={(e) => handleFinishingBlur(e.target.value)}
              placeholder="0"
              className="h-7 w-20 bg-background text-xs font-mono"
            />
            <span className="text-[10px] text-muted-foreground font-mono">EGP</span>
          </div>
        </div>

        {/* Selection State */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 border border-primary/20">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold text-primary">
              {selected.length} Selected
            </span>
          </div>
          {selected.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelected([])}
              className="h-7 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5"
            >
              <X className="size-3" />
              <span className="text-[10px] uppercase font-bold tracking-tight">Clear</span>
            </Button>
          )}
        </div>

        <span className="ml-auto text-xs text-muted-foreground hidden sm:inline">
          Click cards to select for comparison
        </span>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <PropertyCard
            key={p.id}
            property={p}
            plan={plan}
            isSelected={selected.includes(p.id)}
            onSelect={toggleSelect}
            cheapestCustom={cheapestCustom}
            cheapestStd={cheapestStd}
            finances={finances}
            privacyMode={privacyMode}
            finishingPricePerSqm={finishingPricePerSqm}
          />
        ))}
      </div>

      {/* Comparison Table */}
      {selected.length >= 2 && (
        <ComparisonTable 
          selected={selected} 
          plan={plan} 
          finishingPricePerSqm={finishingPricePerSqm} 
        />
      )}

      {/* Visual Charts - Moved back to bottom per user feedback */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <PriceComparisonChart plan={plan} />
        <NpvComparisonChart />
      </div>

      {/* Footer notes */}
      <div className="space-y-1 pb-8 text-xs text-muted-foreground">
        <p>
          All prices in EGP. TALALA units are fully finished. Club Views &amp;
          Elm Tree Park are core &amp; shell — add ~15-25% for finishing costs.
        </p>
        <p>
          NPV calculated at rate 0.7239 (≈19% CBE deposit rate). Customized
          plans offer quarterly payments with higher effective discounts.
        </p>
        <p>
          Data sourced from your uploaded payment plan PDFs. Developer:
          Madinet Masr (EGX: MASR.CA).
        </p>
      </div>
    </div>
  );
}
