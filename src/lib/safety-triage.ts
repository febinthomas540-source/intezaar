export const SAFETY_REPORT_CATEGORIES = [
  "immediate_danger",
  "terrorism_or_violence",
  "child_sexual_exploitation",
  "sexual_exploitation_or_intimate_abuse",
  "harassment_or_stalking",
  "fraud_or_extortion",
  "hate_or_threats",
  "privacy_or_impersonation",
  "spam_or_other",
] as const;

export type SafetyReportCategory = (typeof SAFETY_REPORT_CATEGORIES)[number];
export type SafetyPriority = "standard" | "high" | "critical";

const criticalCategories = new Set<SafetyReportCategory>([
  "immediate_danger",
  "terrorism_or_violence",
  "child_sexual_exploitation",
]);

const highCategories = new Set<SafetyReportCategory>([
  "sexual_exploitation_or_intimate_abuse",
  "harassment_or_stalking",
  "fraud_or_extortion",
  "hate_or_threats",
]);

const urgentIndicators = [
  "kill",
  "bomb",
  "attack",
  "weapon",
  "explosive",
  "kidnap",
  "blackmail",
  "extort",
  "tonight",
  "right now",
  "immediately",
  "child",
  "minor",
] as const;

export function validSafetyReportCategory(value: string): value is SafetyReportCategory {
  return (SAFETY_REPORT_CATEGORIES as readonly string[]).includes(value);
}

export function triageSafetyReport(input: {
  category: SafetyReportCategory;
  details: string;
  urgent: boolean;
}) {
  const normalized = input.details.toLowerCase();
  const indicatorMatches = urgentIndicators.filter((word) => normalized.includes(word));

  let priority: SafetyPriority = "standard";
  if (highCategories.has(input.category)) priority = "high";
  if (criticalCategories.has(input.category) || input.urgent) priority = "critical";

  // Details are supplied voluntarily by the reporter. Keyword matching is used
  // only to prioritise human review; it never makes a final moderation decision.
  if (priority === "standard" && indicatorMatches.length > 0) priority = "high";
  if (priority === "high" && indicatorMatches.length >= 2) priority = "critical";

  return {
    priority,
    indicatorCount: indicatorMatches.length,
    requiresHumanReview: true,
    automaticEnforcement: false,
  } as const;
}

export function higherSafetyPriority(
  first: unknown,
  second: SafetyPriority,
): SafetyPriority {
  const rank: Record<SafetyPriority, number> = {
    standard: 1,
    high: 2,
    critical: 3,
  };
  const current = first === "standard" || first === "high" || first === "critical"
    ? first
    : "standard";
  return rank[second] > rank[current] ? second : current;
}
