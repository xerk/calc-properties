import { type Property, type Finances, type PlanType, isCoreAndShell } from "./data";

export type RecommendationCategory = "excellent" | "good" | "stretch" | "unaffordable";

export interface PropertyScore {
  propertyId: number;
  totalScore: number; // 0-100
  affordabilityScore: number; // 0-50 (50% weight)
  safetyScore: number; // 0-30 (30% weight)
  valueScore: number; // 0-20 (20% weight)
  recommendation: RecommendationCategory;
  highlights: string[]; // Why this property is recommended
}

interface ScoringContext {
  cheapestNpvPerSqm: number;
  cheapestPricePerSqm: number;
  avgPricePerSqm: number;
}

function getPaymentDetails(property: Property, plan: PlanType) {
  const final = plan === "custom" ? property.customFinal : property.standardFinal;
  const downPayment = plan === "custom" ? property.downPaymentCustom : property.downPaymentStd;
  const quarterly = plan === "custom" ? property.quarterlyCustom : (property.quarterlyStd || 0);
  const monthly = property.monthlyStd || 0;
  const duration = plan === "custom" ? property.customDuration : property.standardDuration;

  let avgMonthly: number;
  if (plan === "custom") {
    avgMonthly = quarterly / 3;
  } else if (monthly > 0) {
    avgMonthly = (final - downPayment) / (duration * 12);
  } else if (quarterly > 0) {
    avgMonthly = quarterly / 3;
  } else {
    avgMonthly = (final - downPayment) / (duration * 12);
  }

  return { final, downPayment, avgMonthly, duration };
}

function calculateAffordabilityScore(
  property: Property,
  finances: Finances,
  plan: PlanType,
  finishingPricePerSqm: number
): { score: number; highlights: string[] } {
  const { downPayment, avgMonthly } = getPaymentDetails(property, plan);
  const highlights: string[] = [];
  let score = 0;

  // Core affordability gates (binary checks)
  const needsFinishing = isCoreAndShell(property.project);
  const finishingCost = needsFinishing ? finishingPricePerSqm * property.bua : 0;
  const totalDownPayment = downPayment + (needsFinishing ? finishingCost * 0.3 : 0); // Assume 30% of finishing upfront

  // Can afford down payment? (15 points)
  const downPaymentRatio = finances.balance / totalDownPayment;
  if (downPaymentRatio >= 1) {
    score += 15;
    if (downPaymentRatio >= 1.5) {
      highlights.push("Strong down payment buffer");
    }
  } else {
    // Partial credit based on how close
    score += Math.max(0, 10 * downPaymentRatio);
  }

  // Buffer remaining after down payment (10 points)
  const remainingBuffer = finances.balance - totalDownPayment;
  if (remainingBuffer > 0) {
    const bufferMonths = remainingBuffer / avgMonthly;
    if (bufferMonths >= 12) {
      score += 10;
      highlights.push("12+ months emergency buffer");
    } else if (bufferMonths >= 6) {
      score += 7;
      highlights.push("6+ months emergency buffer");
    } else if (bufferMonths >= 3) {
      score += 4;
    }
  }

  // Can afford monthly at max salary? (10 points)
  const maxSalaryRatio = avgMonthly / finances.maxMonthly;
  if (maxSalaryRatio <= 0.3) {
    score += 10;
    highlights.push("Low payment burden (<30% of income)");
  } else if (maxSalaryRatio <= 0.5) {
    score += 7;
  } else if (maxSalaryRatio <= 0.7) {
    score += 4;
  }

  // CRITICAL: Can afford at worst case salary? (15 points)
  const worstSalaryRatio = avgMonthly / finances.worstMonthly;
  if (worstSalaryRatio <= 0.5) {
    score += 15;
    highlights.push("Affordable even at minimum income");
  } else if (worstSalaryRatio <= 0.7) {
    score += 10;
  } else if (worstSalaryRatio <= 0.9) {
    score += 5;
  } else if (worstSalaryRatio <= 1) {
    score += 2;
  }
  // If ratio > 1, this property is unaffordable at worst case

  return { score: Math.min(50, score), highlights };
}

function calculateSafetyScore(
  property: Property,
  finances: Finances,
  plan: PlanType
): { score: number; highlights: string[] } {
  const { avgMonthly, duration } = getPaymentDetails(property, plan);
  const highlights: string[] = [];
  let score = 0;

  // Payment safety margin (10 points)
  const worstSalaryRatio = avgMonthly / finances.worstMonthly;
  if (worstSalaryRatio <= 0.3) {
    score += 10;
    highlights.push("Very safe payment ratio");
  } else if (worstSalaryRatio <= 0.5) {
    score += 7;
  } else if (worstSalaryRatio <= 0.7) {
    score += 4;
  }

  // Finished status (10 points) - finished = less risk
  if (property.finished) {
    score += 10;
    highlights.push("Ready to move in (finished)");
  } else {
    // Core & shell has construction risk
    score += 5;
  }

  // Payment duration (5 points) - shorter is safer
  if (duration <= 8) {
    score += 5;
    highlights.push("Short payment duration");
  } else if (duration <= 10) {
    score += 3;
  } else if (duration <= 12) {
    score += 2;
  }

  // Maintenance affordability (5 points)
  if (finances.balance >= property.maintenanceAmount * 2) {
    score += 5;
  } else if (finances.balance >= property.maintenanceAmount) {
    score += 3;
  }

  return { score: Math.min(30, score), highlights };
}

function calculateValueScore(
  property: Property,
  plan: PlanType,
  finishingPricePerSqm: number,
  context: ScoringContext
): { score: number; highlights: string[] } {
  const needsFinishing = isCoreAndShell(property.project);
  const finishingCost = needsFinishing ? finishingPricePerSqm * property.bua : 0;
  const final = (plan === "custom" ? property.customFinal : property.standardFinal) + finishingCost;

  const highlights: string[] = [];
  let score = 0;

  // NPV per sqm ranking (8 points)
  const npvPerSqm = property.npv / property.bua;
  const npvRatio = npvPerSqm / context.cheapestNpvPerSqm;
  if (npvRatio <= 1.1) {
    score += 8;
    highlights.push("Best NPV value");
  } else if (npvRatio <= 1.2) {
    score += 6;
  } else if (npvRatio <= 1.3) {
    score += 4;
  } else {
    score += 2;
  }

  // Price per sqm ranking (8 points)
  const pricePerSqm = final / property.bua;
  const priceRatio = pricePerSqm / context.cheapestPricePerSqm;
  if (priceRatio <= 1.1) {
    score += 8;
    highlights.push("Best price/sqm");
  } else if (priceRatio <= 1.2) {
    score += 6;
  } else if (priceRatio <= 1.3) {
    score += 4;
  } else {
    score += 2;
  }

  // Discount quality (4 points)
  const discountPct = (plan === "custom" ? property.customDiscount : property.standardDiscount) / property.unitPrice;
  if (discountPct >= 0.25) {
    score += 4;
    highlights.push("Strong discount (25%+)");
  } else if (discountPct >= 0.2) {
    score += 3;
  } else if (discountPct >= 0.15) {
    score += 2;
  } else {
    score += 1;
  }

  return { score: Math.min(20, score), highlights };
}

function getRecommendationCategory(
  totalScore: number,
  avgMonthly: number,
  finances: Finances
): RecommendationCategory {
  const worstRatio = avgMonthly / finances.worstMonthly;
  const maxRatio = avgMonthly / finances.maxMonthly;

  // Truly unaffordable: can't afford even at max salary
  if (maxRatio > 1) {
    return "unaffordable";
  }

  // Can afford at max salary but not at worst → "stretch" regardless of score
  if (worstRatio > 1) {
    return "stretch";
  }

  // Can afford at worst salary → use score-based categories
  if (totalScore >= 75) {
    return "excellent";
  }
  if (totalScore >= 55) {
    return "good";
  }
  if (totalScore >= 40) {
    return "stretch";
  }
  return "stretch"; // Even low scores are "stretch" if affordable
}

export function calculatePropertyScore(
  property: Property,
  finances: Finances,
  plan: PlanType,
  finishingPricePerSqm: number,
  context: ScoringContext
): PropertyScore {
  const { avgMonthly } = getPaymentDetails(property, plan);

  const affordability = calculateAffordabilityScore(property, finances, plan, finishingPricePerSqm);
  const safety = calculateSafetyScore(property, finances, plan);
  const value = calculateValueScore(property, plan, finishingPricePerSqm, context);

  const totalScore = affordability.score + safety.score + value.score;
  const allHighlights = [...affordability.highlights, ...safety.highlights, ...value.highlights];

  return {
    propertyId: property.id,
    totalScore,
    affordabilityScore: affordability.score,
    safetyScore: safety.score,
    valueScore: value.score,
    recommendation: getRecommendationCategory(totalScore, avgMonthly, finances),
    highlights: allHighlights.slice(0, 3), // Top 3 highlights
  };
}

export function calculateAllPropertyScores(
  properties: Property[],
  finances: Finances,
  plan: PlanType,
  finishingPricePerSqm: number
): PropertyScore[] {
  if (properties.length === 0) return [];

  // Build context for relative comparisons
  const context: ScoringContext = {
    cheapestNpvPerSqm: Math.min(...properties.map(p => p.npv / p.bua)),
    cheapestPricePerSqm: Math.min(...properties.map(p => {
      const needsFinishing = isCoreAndShell(p.project);
      const finishingCost = needsFinishing ? finishingPricePerSqm * p.bua : 0;
      const final = (plan === "custom" ? p.customFinal : p.standardFinal) + finishingCost;
      return final / p.bua;
    })),
    avgPricePerSqm: properties.reduce((sum, p) => {
      const needsFinishing = isCoreAndShell(p.project);
      const finishingCost = needsFinishing ? finishingPricePerSqm * p.bua : 0;
      const final = (plan === "custom" ? p.customFinal : p.standardFinal) + finishingCost;
      return sum + final / p.bua;
    }, 0) / properties.length,
  };

  return properties.map(p => calculatePropertyScore(p, finances, plan, finishingPricePerSqm, context));
}

export function getRecommendedProperties(
  scores: PropertyScore[],
  limit: number = 3
): PropertyScore[] {
  return [...scores]
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit);
}

export function getRecommendationBadgeColor(recommendation: RecommendationCategory): string {
  switch (recommendation) {
    case "excellent":
      return "bg-emerald-500 text-white";
    case "good":
      return "bg-blue-500 text-white";
    case "stretch":
      return "bg-amber-500 text-white";
    case "unaffordable":
      return "bg-red-500/50 text-red-200";
  }
}

export function getRecommendationLabel(recommendation: RecommendationCategory): string {
  switch (recommendation) {
    case "excellent":
      return "Excellent Match";
    case "good":
      return "Good Match";
    case "stretch":
      return "Stretch";
    case "unaffordable":
      return "Unaffordable";
  }
}
