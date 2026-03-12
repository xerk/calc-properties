"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Trash, Check, Save } from "lucide-react";
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

  useEffect(() => {
    fetchScenarios();
  }, []);

  async function fetchScenarios() {
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
      setScenarios([...scenarios, data]);
      setNewName("");
    } catch (err) {
      console.error("Save scenario failed", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/scenarios?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setScenarios(scenarios.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete scenario failed", err);
    }
  }

  return (
    <TooltipProvider>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-sm">Saved Scenarios</CardTitle>
          <CardAction>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="New scenario name..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="h-7 text-xs"
                    disabled={saving}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2"
                    onClick={handleSave}
                    disabled={saving || !newName.trim()}
                  >
                    {saving ? <Spinner /> : <Plus className="size-3" />}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>Save current inputs as a new scenario</TooltipContent>
            </Tooltip>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[160px] overflow-y-auto pr-2">
          {loading ? (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          ) : scenarios.length === 0 ? (
            <p className="text-xs text-muted-foreground italic py-2">No saved scenarios yet</p>
          ) : (
            scenarios.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between group rounded-md border border-transparent hover:border-border hover:bg-muted p-1 px-2 transition-all"
              >
                <button
                  className="text-xs font-medium text-foreground text-left flex-1"
                  onClick={() => onLoad(s)}
                >
                  {s.name}
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-muted-foreground mr-2 font-mono">
                    ${Math.round(s.balanceUSD/1000)}k
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(s.id)}
                  >
                    <Trash className="size-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
