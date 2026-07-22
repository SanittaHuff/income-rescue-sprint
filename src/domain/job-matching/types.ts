export interface JobMatchRequest {
  jobTitle: string;
  jobDescription: string;
  certifiedComponentTexts: string[];
}

export type JobTermPriority = "required" | "preferred" | "general";
export type NavigationRecommendation =
  | "Proceed to human review"
  | "Investigate evidence before resume changes"
  | "Responsible pause — strengthen the evidence base";

export interface JobMatchTerm {
  term: string;
  status: "supported" | "gap";
  priority: JobTermPriority;
  evidenceExcerpt?: string;
}

export interface PriorityCoverage {
  supported: number;
  total: number;
  percent: number | null;
}

export interface JobMatchResult {
  score: number;
  confidence: "low" | "medium" | "high";
  evidenceComponentCount: number;
  supportedTerms: string[];
  gaps: string[];
  requiredGaps: string[];
  preferredGaps: string[];
  coverage: Record<JobTermPriority, PriorityCoverage>;
  terms: JobMatchTerm[];
  explanation: string;
  highestRoiNextStep: string;
  recommendation: NavigationRecommendation;
  recommendationRationale: string;
}
