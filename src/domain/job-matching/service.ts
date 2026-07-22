import type {
  JobMatchRequest,
  JobMatchResult,
  JobMatchTerm,
  JobTermPriority,
  NavigationRecommendation,
  PriorityCoverage,
} from "./types.js";

const stop = new Set(["and","the","for","with","from","that","this","you","your","are","will","have","has","our","their","into","using","use","job","role","work","years","team","strong","experience","required","preferred","skills","must","should","plus","ability","knowledge"]);
const aliases: Record<string, string> = {
  ado: "azure-devops", azuredevops: "azure-devops", devops: "azure-devops", azdo: "azure-devops",
  m365: "microsoft-365", o365: "microsoft-365", office365: "microsoft-365",
  powershell: "powershell", "power-shell": "powershell", kusto: "kql", "azure-monitor": "monitor",
  cicd: "ci-cd", "ci/cd": "ci-cd", terraform: "terraform", kubernetes: "kubernetes",
};
const normalize = (term: string): string => {
  const clean = term.replace(/[^a-z0-9+#./-]/g, "").replace(/[.]+$/g, "");
  if (["administer", "administered", "administrator", "administration", "admin"].includes(clean)) return "administer";
  if (["report", "reports", "reporting"].includes(clean)) return "reporting";
  if (["pipeline", "pipelines"].includes(clean)) return "pipelines";
  if (["migration", "migrations", "migrate", "migrated"].includes(clean)) return "migrations";
  return aliases[clean] ?? clean;
};
const terms = (text: string): string[] => [...new Set((text.toLowerCase().match(/[a-z][a-z0-9+#./-]{2,}/g) ?? []).filter((word) => !stop.has(word)).map(normalize))];

const sectionPriority = (line: string, current: JobTermPriority): JobTermPriority => {
  const lower = line.toLowerCase();
  if (/\b(required|minimum qualifications?|must[- ]have|mandatory)\b/.test(lower)) return "required";
  if (/\b(preferred|nice[- ]to[- ]have|bonus|desired)\b/.test(lower)) return "preferred";
  if (/\b(responsibilities|general|about the role|what you will do)\b/.test(lower)) return "general";
  return current;
};

const parsePrioritizedTerms = (title: string, description: string): Array<{ term: string; priority: JobTermPriority }> => {
  const found = new Map<string, JobTermPriority>();
  for (const term of terms(title)) found.set(term, "general");
  let current: JobTermPriority = "general";
  for (const rawLine of description.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const segments = line.split(/(?=\b(?:Required|Preferred|Must[- ]have|Mandatory|Nice[- ]to[- ]have|Bonus|Desired)\b\s*:)/i).filter(Boolean);
    for (const segment of segments) {
      const lower = segment.toLowerCase();
      const inlineRequired = /\b(required|must[- ]have|mandatory|minimum qualification)\b/.test(lower);
      const inlinePreferred = /\b(preferred|nice[- ]to[- ]have|bonus|desired)\b/.test(lower);
      const priority: JobTermPriority = inlineRequired && !inlinePreferred ? "required" : inlinePreferred && !inlineRequired ? "preferred" : sectionPriority(segment, current);
      current = priority;
      for (const term of terms(segment)) {
        const existing = found.get(term);
        if (!existing || priority === "required" || (priority === "preferred" && existing === "general")) found.set(term, priority);
      }
    }
  }
  return [...found].map(([term, priority]) => ({ term, priority }));
};

const weight = (priority: JobTermPriority): number => priority === "required" ? 3 : priority === "preferred" ? 1.5 : 1;
const coverageFor = (items: JobMatchTerm[], priority: JobTermPriority): PriorityCoverage => {
  const relevant = items.filter((item) => item.priority === priority);
  const supported = relevant.filter((item) => item.status === "supported").length;
  return { supported, total: relevant.length, percent: relevant.length ? Math.round((supported / relevant.length) * 100) : null };
};
const recommendationFor = (score: number, requiredGaps: string[], evidenceCount: number): { recommendation: NavigationRecommendation; rationale: string } => {
  if (!evidenceCount || score < 35) return { recommendation: "Responsible pause — strengthen the evidence base", rationale: "The current certified evidence base is too limited for a responsible fit recommendation." };
  if (requiredGaps.length) return { recommendation: "Investigate evidence before resume changes", rationale: `Required evidence gaps remain, beginning with ${requiredGaps[0]}. Search existing evidence before changing the resume.` };
  return { recommendation: "Proceed to human review", rationale: "No required evidence gaps were identified. A person should still review wording, evidence trace, role lane, and remaining gaps before export." };
};

export const matchCertifiedResumeToJob = (request: JobMatchRequest): JobMatchResult => {
  const prioritizedTerms = parsePrioritizedTerms(request.jobTitle, request.jobDescription);
  const components = request.certifiedComponentTexts.map((text) => ({ text, terms: new Set(terms(text)) }));
  const matched: JobMatchTerm[] = prioritizedTerms.map(({ term, priority }) => {
    const component = components.find((item) => item.terms.has(term));
    return component ? { term, status: "supported", priority, evidenceExcerpt: component.text.slice(0, 180) } : { term, status: "gap", priority };
  });
  const supportedTerms = matched.filter((item) => item.status === "supported").map((item) => item.term);
  const gapItems = matched.filter((item) => item.status === "gap");
  const requiredGaps = gapItems.filter((item) => item.priority === "required").map((item) => item.term);
  const preferredGaps = gapItems.filter((item) => item.priority === "preferred").map((item) => item.term);
  const gaps = [...requiredGaps, ...gapItems.filter((item) => item.priority === "general").map((item) => item.term), ...preferredGaps].slice(0, 12);
  const denominator = matched.reduce((sum, item) => sum + weight(item.priority), 0);
  const numerator = matched.filter((item) => item.status === "supported").reduce((sum, item) => sum + weight(item.priority), 0);
  const score = denominator ? Math.round((numerator / denominator) * 100) : 0;
  const confidence = request.certifiedComponentTexts.length >= 5 ? "high" : request.certifiedComponentTexts.length >= 2 ? "medium" : "low";
  const highestRoiGap = requiredGaps[0] ?? gaps[0];
  const highestRoiNextStep = highestRoiGap ? `Review the highest-value gap: ${highestRoiGap}. Search existing evidence before changing the resume.` : "Review the matched evidence and prepare a governed job-specific resume.";
  const recommendation = recommendationFor(score, requiredGaps, request.certifiedComponentTexts.length);
  return {
    score,
    confidence,
    evidenceComponentCount: request.certifiedComponentTexts.length,
    supportedTerms,
    gaps,
    requiredGaps,
    preferredGaps,
    coverage: { required: coverageFor(matched, "required"), preferred: coverageFor(matched, "preferred"), general: coverageFor(matched, "general") },
    terms: matched,
    explanation: "The weighted score compares normalized job-language terms only with certified resume components. Required terms carry more weight. Gaps are investigation prompts, not proof that the candidate lacks the experience.",
    highestRoiNextStep,
    recommendation: recommendation.recommendation,
    recommendationRationale: recommendation.rationale,
  };
};
