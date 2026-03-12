"use client";

import { type Finances, fmtK } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FinancialProfileProps {
  balanceUSD: number;
  maxSalaryUSD: number;
  worstSalaryUSD: number;
  exchangeRate: number;
  finances: Finances;
  onBalanceChange: (v: number) => void;
  onMaxSalaryChange: (v: number) => void;
  onWorstSalaryChange: (v: number) => void;
  onExchangeRateChange: (v: number) => void;
}

export function FinancialProfile({
  balanceUSD,
  maxSalaryUSD,
  worstSalaryUSD,
  exchangeRate,
  finances,
  onBalanceChange,
  onMaxSalaryChange,
  onWorstSalaryChange,
  onExchangeRateChange,
}: FinancialProfileProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Your Financial Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Available Balance (USD)
            </Label>
            <Input
              type="number"
              value={balanceUSD}
              onChange={(e) => onBalanceChange(Number(e.target.value))}
              className="font-mono"
            />
            <p className="font-mono text-xs text-muted-foreground">
              = {fmtK(balanceUSD * exchangeRate)} EGP
            </p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Max Monthly Salary (USD)
            </Label>
            <Input
              type="number"
              value={maxSalaryUSD}
              onChange={(e) => onMaxSalaryChange(Number(e.target.value))}
              className="font-mono"
            />
            <p className="font-mono text-xs text-muted-foreground">
              = {fmtK(maxSalaryUSD * exchangeRate)} EGP
            </p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Worst Case Salary (USD)
            </Label>
            <Input
              type="number"
              value={worstSalaryUSD}
              onChange={(e) => onWorstSalaryChange(Number(e.target.value))}
              className="font-mono"
            />
            <p className="font-mono text-xs text-muted-foreground">
              = {fmtK(worstSalaryUSD * exchangeRate)} EGP
            </p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              USD → EGP Rate
            </Label>
            <Input
              type="number"
              value={exchangeRate}
              onChange={(e) => onExchangeRateChange(Number(e.target.value))}
              className="font-mono"
            />
          </div>
        </div>

        {/* Quick Summary */}
        <div className="flex flex-wrap gap-3 pt-2">
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-muted-foreground">Balance:</span>
            <span className="font-mono text-xs font-semibold text-foreground">
              {fmtK(finances.balance)} EGP
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Max/mo:</span>
            <span className="font-mono text-xs font-semibold text-foreground">
              {fmtK(finances.maxMonthly)} EGP
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-xs text-muted-foreground">Worst/mo:</span>
            <span className="font-mono text-xs font-semibold text-foreground">
              {fmtK(finances.worstMonthly)} EGP
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
