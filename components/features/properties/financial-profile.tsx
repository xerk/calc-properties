"use client";

import { useState } from "react";
import { type Finances, fmtK } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface FinancialProfileProps {
  balanceUSD: number;
  maxSalaryUSD: number;
  worstSalaryUSD: number;
  exchangeRate: number;
  finances: Finances;
  privacyMode: boolean;
  rateLoading: boolean;
  rateError: string | null;
  onBalanceChange: (v: number) => void;
  onMaxSalaryChange: (v: number) => void;
  onWorstSalaryChange: (v: number) => void;
  onPrivacyToggle: (v: boolean) => void;
}

function mask(value: string, privacyMode: boolean): string {
  return privacyMode ? "•••••" : value;
}

function formatNumber(val: number): string {
  return new Intl.NumberFormat("en-US").format(val);
}

function parseNumber(val: string): number {
  const clean = val.replace(/,/g, "").toLowerCase();
  if (clean.endsWith("k")) return parseFloat(clean) * 1000;
  if (clean.endsWith("m")) return parseFloat(clean) * 1000000;
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function FinancialProfile({
  balanceUSD,
  maxSalaryUSD,
  worstSalaryUSD,
  exchangeRate,
  finances,
  privacyMode,
  rateLoading,
  rateError,
  onBalanceChange,
  onMaxSalaryChange,
  onWorstSalaryChange,
  onPrivacyToggle,
}: FinancialProfileProps) {
  const [balanceInput, setBalanceInput] = useState(formatNumber(balanceUSD));
  const [maxInput, setMaxInput] = useState(formatNumber(maxSalaryUSD));
  const [worstInput, setWorstInput] = useState(formatNumber(worstSalaryUSD));

  const handleChange = (
    val: string,
    displaySetter: (v: string) => void,
    setter: (v: number) => void
  ) => {
    // If user types 'k' or 'm', expand immediately for better feedback
    if (/[\d.]+[km]$/i.test(val)) {
      const num = parseNumber(val);
      const formatted = formatNumber(num);
      displaySetter(formatted);
      setter(num);
    } else {
      displaySetter(val);
      // Update the actual number if it's a valid digit/comma string
      const num = parseNumber(val);
      if (!isNaN(num)) setter(num);
    }
  };

  const handleBlur = (
    val: string,
    displaySetter: (v: string) => void,
    setter: (v: number) => void
  ) => {
    const num = parseNumber(val);
    setter(num);
    displaySetter(formatNumber(num));
  };

  return (
    <TooltipProvider>
      <Collapsible defaultOpen>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Your Financial Profile</CardTitle>
            <CardAction>
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="privacy-switch" className="text-xs text-muted-foreground cursor-pointer">
                        {privacyMode ? "🔒 Hidden" : "👁 Visible"}
                      </Label>
                      <Switch
                        id="privacy-switch"
                        size="sm"
                        checked={privacyMode}
                        onCheckedChange={onPrivacyToggle}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Hide your personal financial capacity during meetings
                  </TooltipContent>
                </Tooltip>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 px-2">
                    Toggle
                  </Button>
                </CollapsibleTrigger>
              </div>
            </CardAction>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-1.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="text-xs text-muted-foreground cursor-help">
                        Available Balance (USD) ⓘ
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      Total liquid savings you can use for down payment and maintenance. Supports "71.3K" or "10,000".
                    </TooltipContent>
                  </Tooltip>
                  <Input
                    type={privacyMode ? "password" : "text"}
                    value={balanceInput}
                    onChange={(e) => handleChange(e.target.value, setBalanceInput, onBalanceChange)}
                    onBlur={(e) => handleBlur(e.target.value, setBalanceInput, onBalanceChange)}
                    className="font-mono"
                  />
                  <p className="font-mono text-xs text-muted-foreground">
                    = {mask(fmtK(balanceUSD * exchangeRate), privacyMode)} EGP
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="text-xs text-muted-foreground cursor-help">
                        Max Monthly Salary (USD) ⓘ
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      Your best-case monthly income used for installment affordability. Supports "10K".
                    </TooltipContent>
                  </Tooltip>
                  <Input
                    type={privacyMode ? "password" : "text"}
                    value={maxInput}
                    onChange={(e) => handleChange(e.target.value, setMaxInput, onMaxSalaryChange)}
                    onBlur={(e) => handleBlur(e.target.value, setMaxInput, onMaxSalaryChange)}
                    className="font-mono"
                  />
                  <p className="font-mono text-xs text-muted-foreground">
                    = {mask(fmtK(maxSalaryUSD * exchangeRate), privacyMode)} EGP
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="text-xs text-muted-foreground cursor-help">
                        Worst Case Salary (USD) ⓘ
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      Minimum expected monthly income — stress-tests your ability to pay.
                    </TooltipContent>
                  </Tooltip>
                  <Input
                    type={privacyMode ? "password" : "text"}
                    value={worstInput}
                    onChange={(e) => handleChange(e.target.value, setWorstInput, onWorstSalaryChange)}
                    onBlur={(e) => handleBlur(e.target.value, setWorstInput, onWorstSalaryChange)}
                    className="font-mono"
                  />
                  <p className="font-mono text-xs text-muted-foreground">
                    = {mask(fmtK(worstSalaryUSD * exchangeRate), privacyMode)} EGP
                  </p>
                </div>


              </div>

              {/* Quick Summary */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 rounded-lg bg-accent px-3 py-1.5 cursor-help">
                      <span className="text-xs text-muted-foreground">USD→EGP:</span>
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {rateLoading ? "…" : exchangeRate}
                      </span>
                      {rateError && <span className="text-xs text-amber-400">⚠</span>}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {rateLoading
                      ? "Fetching live rate…"
                      : rateError
                        ? `Fallback rate (${rateError})`
                        : "Live rate from Open Exchange Rates"}
                  </TooltipContent>
                </Tooltip>
                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-muted-foreground">Balance:</span>
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {mask(fmtK(finances.balance), privacyMode)} EGP
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground">Max/mo:</span>
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {mask(fmtK(finances.maxMonthly), privacyMode)} EGP
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="text-xs text-muted-foreground">Worst/mo:</span>
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {mask(fmtK(finances.worstMonthly), privacyMode)} EGP
                  </span>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </TooltipProvider>
  );
}
