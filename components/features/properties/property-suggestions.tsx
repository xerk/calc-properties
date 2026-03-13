"use client";

import { useMemo } from "react";
import { type Property, type Finances, type PlanType, fmtK, pct, isCoreAndShell } from "@/lib/data";
import {
  calculateAllPropertyScores,
  getRecommendedProperties,
  getRecommendationBadgeColor,
  getRecommendationLabel,
  type PropertyScore,
} from "@/lib/scoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Shield, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertySuggestionsProps {
  properties: Property[];
  finances: Finances;
  plan: PlanType;
  finishingPricePerSqm: number;
  onSelectProperty: (id: number) => void;
  selectedIds: number[];
}

function ScoreMeter({ label, score, maxScore }: { label: string; score: number; maxScore: number }) {
  const percentage = (score / maxScore) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-muted-foreground uppercase tracking-tight">{label}</span>
        <span className="font-mono text-foreground">{score}/{maxScore}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function SuggestionCard({
  property,
  score,
  plan,
  finishingPricePerSqm,
  onSelect,
  isSelected,
  rank,
}: {
  property: Property;
  score: PropertyScore;
  plan: PlanType;
  finishingPricePerSqm: number;
  onSelect: (id: number) => void;
  isSelected: boolean;
  rank: number;
}) {
  const needsFinishing = isCoreAndShell(property.project);
  const finishingCost = needsFinishing ? finishingPricePerSqm * property.bua : 0;
  const final = (plan === "custom" ? property.customFinal : property.standardFinal) + finishingCost;
  const downPayment = plan === "custom" ? property.downPaymentCustom : property.downPaymentStd;

  return (
    <Card
      className={cn(
        "relative overflow-visible cursor-pointer transition-all hover:border-primary/50",
        isSelected && "ring-2 ring-primary border-primary/50"
      )}
      onClick={() => onSelect(property.id)}
    >
      {/* Rank Badge */}
      <div className="absolute -top-2 -left-2 z-20 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-lg">
        {rank}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-foreground">
                {property.project} {property.type}
              </h4>
              <Badge
                className={cn(
                  "text-[9px] font-bold uppercase tracking-tight px-2 py-0.5",
                  getRecommendationBadgeColor(score.recommendation)
                )}
              >
                {getRecommendationLabel(score.recommendation)}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {property.bua} sqm · {property.location}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">{score.totalScore}</p>
            <p className="text-[9px] text-muted-foreground uppercase">Score</p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-3 gap-2">
          <ScoreMeter label="Afford" score={score.affordabilityScore} maxScore={50} />
          <ScoreMeter label="Safety" score={score.safetyScore} maxScore={30} />
          <ScoreMeter label="Value" score={score.valueScore} maxScore={20} />
        </div>

        {/* Key Metrics */}
        <div className="flex justify-between text-xs border-t border-border/50 pt-2">
          <div>
            <span className="text-muted-foreground">Final:</span>{" "}
            <span className="font-mono font-medium">{fmtK(final)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Down:</span>{" "}
            <span className="font-mono font-medium">{fmtK(downPayment)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">NPV:</span>{" "}
            <span className="font-mono font-medium">{fmtK(property.npv)}</span>
          </div>
        </div>

        {/* Highlights */}
        {score.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {score.highlights.map((highlight, i) => (
              <Badge
                key={i}
                variant="outline"
                className="text-[9px] px-1.5 py-0 border-primary/30 text-primary"
              >
                {highlight}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function PropertySuggestions({
  properties,
  finances,
  plan,
  finishingPricePerSqm,
  onSelectProperty,
  selectedIds,
}: PropertySuggestionsProps) {
  const scores = useMemo(
    () => calculateAllPropertyScores(properties, finances, plan, finishingPricePerSqm),
    [properties, finances, plan, finishingPricePerSqm]
  );

  const recommendations = useMemo(
    () => getRecommendedProperties(scores, 3),
    [scores]
  );

  const recommendedProperties = useMemo(
    () =>
      recommendations
        .map(rec => ({
          property: properties.find(p => p.id === rec.propertyId)!,
          score: rec,
        }))
        .filter(item => item.property),
    [recommendations, properties]
  );

  if (properties.length === 0 || recommendations.length === 0) {
    return null;
  }

  const hasAffordableOption = recommendations.some(
    r => r.recommendation === "excellent" || r.recommendation === "good"
  );

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm">Recommended for You</CardTitle>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Based on your financial profile
              </p>
            </div>
          </div>
          {hasAffordableOption && (
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[9px] gap-1">
              <Shield className="size-3" />
              Affordable options available
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 gap-4 pt-3 md:grid-cols-3">
          {recommendedProperties.map(({ property, score }, index) => (
            <SuggestionCard
              key={property.id}
              property={property}
              score={score}
              plan={plan}
              finishingPricePerSqm={finishingPricePerSqm}
              onSelect={onSelectProperty}
              isSelected={selectedIds.includes(property.id)}
              rank={index + 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
