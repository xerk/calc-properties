"use client";

import { useState, useMemo } from "react";
import { type PlanType, type SizeFilter, properties } from "@/lib/data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useExchangeRate } from "@/hooks/use-exchange-rate";
import { PropertyCard } from "@/components/features/properties/property-card";
import { ComparisonTable } from "@/components/features/properties/comparison-table";
import { PriceComparisonChart } from "@/components/features/properties/price-comparison-chart";
import { NpvComparisonChart } from "@/components/features/properties/npv-comparison-chart";
import { FinancialProfile } from "@/components/features/properties/financial-profile";

export function PropertyAnalyzer() {
  const [plan, setPlan] = useState<PlanType>("custom");
  const [selected, setSelected] = useState<number[]>([1, 3, 6]);
  const [balanceUSD, setBalanceUSD] = useState(10000);
  const [maxSalaryUSD, setMaxSalaryUSD] = useState(3000);
  const [worstSalaryUSD, setWorstSalaryUSD] = useState(2300);
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>("all");
  const [privacyMode, setPrivacyMode] = useState(false);

  const { rate: exchangeRate, setRate: setExchangeRate, loading: rateLoading, error: rateError } = useExchangeRate();

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
    if (sizeFilter === "212") return p.bua <= 215;
    if (sizeFilter === "239") return p.bua >= 239;
    return true;
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

      {/* Financial Inputs */}
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
      />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          value={plan}
          onValueChange={(v) => setPlan(v as PlanType)}
        >
          <TabsList>
            <TabsTrigger value="custom">Customized Plan</TabsTrigger>
            <TabsTrigger value="standard">Standard Plan</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs
          value={sizeFilter}
          onValueChange={(v) => setSizeFilter(v as SizeFilter)}
        >
          <TabsList>
            <TabsTrigger value="all">All Units</TabsTrigger>
            <TabsTrigger value="212">~212 sqm</TabsTrigger>
            <TabsTrigger value="239">~239+ sqm</TabsTrigger>
          </TabsList>
        </Tabs>

        <span className="ml-auto text-xs text-muted-foreground">
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
          />
        ))}
      </div>

      {/* Comparison Table */}
      {selected.length >= 2 && (
        <ComparisonTable selected={selected} plan={plan} />
      )}

      {/* Visual Charts */}
      <PriceComparisonChart plan={plan} />
      <NpvComparisonChart />

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
