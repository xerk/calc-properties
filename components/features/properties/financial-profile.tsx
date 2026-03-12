"use client";

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
                    Hide all financial figures for privacy during meetings
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
                      Total liquid savings you can use for down payment and maintenance
                    </TooltipContent>
                  </Tooltip>
                  <Input
                    type={privacyMode ? "password" : "number"}
                    value={balanceUSD}
                    onChange={(e) => onBalanceChange(Number(e.target.value))}
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
                      Your best-case monthly income used for installment affordability
                    </TooltipContent>
                  </Tooltip>
                  <Input
                    type={privacyMode ? "password" : "number"}
                    value={maxSalaryUSD}
                    onChange={(e) => onMaxSalaryChange(Number(e.target.value))}
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
                      Minimum expected monthly income — stress-tests your ability to pay
                    </TooltipContent>
                  </Tooltip>
                  <Input
                    type={privacyMode ? "password" : "number"}
                    value={worstSalaryUSD}
                    onChange={(e) => onWorstSalaryChange(Number(e.target.value))}
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
