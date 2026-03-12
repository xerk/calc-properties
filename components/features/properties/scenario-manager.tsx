"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Trash, History, Save } from "lucide-react";
import type { Scenario } from "@/lib/db/schema";

interface ScenarioManagerProps {
  currentProfile: {
    balanceUSD: number;
    maxSalaryUSD: number;
    worstSalaryUSD: number;
    exchangeRate: number;
  };
  onLoad: (s: Scenario) => void;
}

export function ScenarioManager({ currentProfile, onLoad }: ScenarioManagerProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) fetchScenarios();
  }, [open]);

  async function fetchScenarios() {
    setLoading(true);
    try {
      const res = await fetch("/api/scenarios");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setScenarios(data);
    } catch (err) {
      console.error("Fetch scenarios failed", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          ...currentProfile,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setScenarios([data, ...scenarios]);
      setNewName("");
    } catch (err) {
      console.error("Save scenario failed", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/scenarios?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setScenarios(scenarios.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete scenario failed", err);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold gap-1.5 uppercase tracking-wider bg-background/50 backdrop-blur-sm">
          <History className="size-3" />
          Saved Scenarios
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-6">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg">Saved Scenarios</SheetTitle>
          <SheetDescription>
            Switch between different financial profiles or save your current setup.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2">
            <Input
              placeholder="e.g. Aggressive Savings"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="text-sm"
              disabled={saving}
            />
            <Button
              onClick={handleSave}
              disabled={saving || !newName.trim()}
              className="px-3"
            >
              {saving ? <Spinner /> : <Plus className="size-4" />}
            </Button>
          </div>

          <div className="border-t pt-4 flex-1 overflow-y-auto pr-2">
            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : scenarios.length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center py-8">
                No saved scenarios yet.
              </p>
            ) : (
              <div className="space-y-2">
                {scenarios.map((s) => (
                  <div
                    key={s.id}
                    className="group relative flex flex-col rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      onLoad(s);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{s.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleDelete(s.id, e)}
                      >
                        <Trash className="size-3.5" />
                      </Button>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-muted-foreground font-mono">
                      <div className="flex justify-between">
                        <span>Balance:</span>
                        <span className="text-foreground">${Math.round(s.balanceUSD/1000)}k</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max/mo:</span>
                        <span className="text-foreground">${Math.round(s.maxSalaryUSD/1000)}k</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Worst:</span>
                        <span className="text-foreground">${Math.round(s.worstSalaryUSD/1000)}k</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rate:</span>
                        <span className="text-foreground">{s.exchangeRate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
