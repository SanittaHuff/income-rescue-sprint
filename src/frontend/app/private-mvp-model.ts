import { PrivateMvpRuntime } from "../../application/private-mvp-runtime.js";
import type { EvidenceItem } from "../../domain/evidence/types.js";
import type { ResumeComponent } from "../../domain/resume-component/types.js";
import type { NavigationRecommendation, PriorityCoverage } from "../../domain/job-matching/types.js";

export type MvpScreen = "evidence" | "resume" | "match" | "export";
export type EvidenceConfidenceLevel = "verified" | "strong" | "corroborated" | "partial" | "unsupported";
export type EvidenceRecoveryRoute = "upload" | "resume" | "email" | "similar" | "reconstruct" | "roi" | "";
export type ReviewCheck = "wording" | "evidenceTrace" | "roleLane" | "matchGaps";

export interface CertifiedComponentRecord {
  fingerprint: string;
  evidenceText: string;
  evidenceSource: string;
  componentText: string;
  targetLane: string;
  confidenceLevel: EvidenceConfidenceLevel;
  certifiedAt: string;
}

export interface ReviewChecklist {
  wording: boolean;
  evidenceTrace: boolean;
  roleLane: boolean;
  matchGaps: boolean;
}

export interface RestorePreview {
  savedAt: string;
  certifiedCount: number;
  payload: Partial<PrivateMvpUiState>;
}

export interface PrivateMvpUiState {
  activeScreen: MvpScreen;
  evidenceText: string;
  evidenceSource: string;
  confidenceLevel: EvidenceConfidenceLevel;
  recoveryRoute: EvidenceRecoveryRoute;
  componentText: string;
  targetLane: string;
  jobDescription: string;
  statusMessage: string;
  certifiedCount: number;
  certifiedComponentRecords: CertifiedComponentRecord[];
  resumeText: string;
  rtfText: string;
  atsReadable: boolean;
  matchScore: number | null;
  matchConfidence: "low" | "medium" | "high" | null;
  matchedTerms: string[];
  gapTerms: string[];
  requiredGapTerms: string[];
  preferredGapTerms: string[];
  coverage: { required: PriorityCoverage; preferred: PriorityCoverage; general: PriorityCoverage };
  highestRoiNextStep: string;
  recommendation: NavigationRecommendation | "";
  recommendationRationale: string;
  reviewChecklist: ReviewChecklist;
  exportReady: boolean;
  sessionExport: string;
  restorePreview: RestorePreview | null;
}

const emptyCoverage = (): PriorityCoverage => ({ supported: 0, total: 0, percent: null });
const emptyChecklist = (): ReviewChecklist => ({ wording: false, evidenceTrace: false, roleLane: false, matchGaps: false });

export const initialPrivateMvpUiState = (): PrivateMvpUiState => ({
  activeScreen: "evidence",
  evidenceText: "",
  evidenceSource: "",
  confidenceLevel: "verified",
  recoveryRoute: "",
  componentText: "",
  targetLane: "Azure DevOps Administration",
  jobDescription: "",
  statusMessage: "Add one genuine experience and where it came from.",
  certifiedCount: 0,
  certifiedComponentRecords: [],
  resumeText: "",
  rtfText: "",
  atsReadable: false,
  matchScore: null,
  matchConfidence: null,
  matchedTerms: [],
  gapTerms: [],
  requiredGapTerms: [],
  preferredGapTerms: [],
  coverage: { required: emptyCoverage(), preferred: emptyCoverage(), general: emptyCoverage() },
  highestRoiNextStep: "",
  recommendation: "",
  recommendationRationale: "",
  reviewChecklist: emptyChecklist(),
  exportReady: false,
  sessionExport: "",
  restorePreview: null,
});

const invalidateReview = (state: PrivateMvpUiState): void => {
  state.reviewChecklist = emptyChecklist();
  state.exportReady = false;
};

const buildEvidence = (state: PrivateMvpUiState): EvidenceItem => ({
  evidenceId: crypto.randomUUID(), sourceId: crypto.randomUUID(), sourceLocation: state.evidenceSource.trim(),
  exactTextOrFact: state.evidenceText.trim(), evidenceType: "responsibility",
  confidence: state.confidenceLevel === "verified" ? "confirmed" : state.confidenceLevel === "strong" ? "high" : state.confidenceLevel === "corroborated" ? "medium" : state.confidenceLevel === "partial" ? "low" : "unknown",
  verificationStatus: state.confidenceLevel === "verified" || state.confidenceLevel === "strong" ? "verified" : "needs_verification",
  restrictions: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: "captain", lastUpdatedBy: "captain", version: 1,
});

const buildComponent = (state: PrivateMvpUiState): ResumeComponent => ({
  componentId: crypto.randomUUID(), logicalComponentId: crypto.randomUUID(), componentType: "bullet", text: state.componentText.trim(),
  certificationStatus: "draft", approvedLanes: [state.targetLane.trim() || "General"], evidenceLinks: [], experienceLinks: [], restrictions: [],
  truthGateStatus: "not_run", qaStatus: "not_run", version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: "captain", lastUpdatedBy: "captain",
});

export class PrivateMvpUiController {
  private state = initialPrivateMvpUiState();
  private readonly runtime: PrivateMvpRuntime;
  constructor(runtime = new PrivateMvpRuntime()) { this.runtime = runtime; }
  snapshot(): PrivateMvpUiState { return structuredClone(this.state); }
  update(patch: Partial<PrivateMvpUiState>): PrivateMvpUiState {
    const reviewSensitive = ["evidenceText","evidenceSource","confidenceLevel","componentText","targetLane","jobDescription"];
    if (reviewSensitive.some((key) => key in patch)) invalidateReview(this.state);
    this.state = { ...this.state, ...patch };
    return this.snapshot();
  }
  goTo(screen: MvpScreen): PrivateMvpUiState { this.state.activeScreen = screen; return this.snapshot(); }
  certifyCurrent(): PrivateMvpUiState {
    if (!this.state.evidenceText.trim() || !this.state.componentText.trim()) { this.state.statusMessage = "Add the experience and proposed resume statement before review."; return this.snapshot(); }
    if (!this.state.evidenceSource.trim() || ["partial", "unsupported"].includes(this.state.confidenceLevel)) { this.state.statusMessage = "We could not fully verify this experience yet. Your work is saved."; return this.snapshot(); }
    const fingerprint = [this.state.evidenceText, this.state.evidenceSource, this.state.componentText, this.state.targetLane].map((x) => x.trim().toLowerCase()).join("|");
    if (this.state.certifiedComponentRecords.some((record) => record.fingerprint === fingerprint)) {
      this.state.statusMessage = "This exact evidence-linked statement was already certified. No duplicate was created.";
      return this.snapshot();
    }
    const evidence = buildEvidence(this.state); const component = buildComponent(this.state); component.evidenceLinks = [evidence.evidenceId];
    const result = this.runtime.certify(evidence, component);
    if (!result.ok) { this.state.statusMessage = "We could not fully verify this experience yet. Your work is saved."; return this.snapshot(); }
    this.state.certifiedComponentRecords.push({ fingerprint, evidenceText: this.state.evidenceText.trim(), evidenceSource: this.state.evidenceSource.trim(), componentText: this.state.componentText.trim(), targetLane: this.state.targetLane.trim(), confidenceLevel: this.state.confidenceLevel, certifiedAt: new Date().toISOString() });
    this.state.certifiedCount = this.state.certifiedComponentRecords.length;
    invalidateReview(this.state);
    this.state.statusMessage = this.state.confidenceLevel === "corroborated" ? "Recorded as corroborated memory within governed confidence limits." : "Certified. Your evidence and resume statement are now linked and preserved.";
    this.state.activeScreen = "resume"; return this.snapshot();
  }
  selectRecoveryRoute(route: EvidenceRecoveryRoute): PrivateMvpUiState {
    this.state.recoveryRoute = route;
    const messages: Record<Exclude<EvidenceRecoveryRoute, "">, string> = { upload: "Add or upload a supporting record.", resume: "Search historical resumes for matching role, tool, project, or accomplishment language.", email: "Search email for project names, people, deliverables, dates, or tools.", similar: "Use similar job descriptions only as memory aids, never as evidence.", reconstruct: "Reconstruct the experience through company, dates, tools, actions, and outcome.", roi: "Search historical resumes first, then email evidence." };
    this.state.statusMessage = route ? messages[route] : "Choose an evidence recovery route."; return this.snapshot();
  }
  assembleResume(): PrivateMvpUiState {
    const result = this.runtime.assemble({ resumeId: crypto.randomUUID(), title: `${this.state.targetLane} Recruiter Resume`, candidateName: "Private MVP User", targetLane: this.state.targetLane, contactLine: "Contact information remains user-controlled" });
    this.state.resumeText = result.resume.plainText; this.state.rtfText = result.rtf; this.state.atsReadable = result.ats.passed; invalidateReview(this.state);
    this.state.statusMessage = result.ats.passed ? "Resume assembled from certified components and passed the current ATS readability checks." : "Resume assembled, but formatting needs review before export.";
    this.state.activeScreen = "match"; return this.snapshot();
  }
  evaluateMatch(): PrivateMvpUiState {
    if (!this.state.jobDescription.trim()) { this.state.statusMessage = "Paste a job description before running the match review."; return this.snapshot(); }
    const result = this.runtime.match({ jobTitle: this.state.targetLane, jobDescription: this.state.jobDescription });
    this.state.matchScore = result.score; this.state.matchConfidence = result.confidence; this.state.matchedTerms = result.supportedTerms; this.state.gapTerms = result.gaps;
    this.state.requiredGapTerms = result.requiredGaps; this.state.preferredGapTerms = result.preferredGaps; this.state.coverage = result.coverage;
    this.state.highestRoiNextStep = result.highestRoiNextStep; this.state.recommendation = result.recommendation; this.state.recommendationRationale = result.recommendationRationale;
    invalidateReview(this.state); this.state.statusMessage = "Match review complete. Similar job descriptions guide comparison only and do not become evidence."; this.state.activeScreen = "export"; return this.snapshot();
  }
  setReviewCheck(check: ReviewCheck, value: boolean): PrivateMvpUiState {
    if (!this.state.resumeText || this.state.matchScore === null) { this.state.statusMessage = "Complete resume assembly and job-match review before the export checklist."; return this.snapshot(); }
    this.state.reviewChecklist = { ...this.state.reviewChecklist, [check]: value };
    this.state.exportReady = Object.values(this.state.reviewChecklist).every(Boolean);
    this.state.statusMessage = this.state.exportReady ? "All four review checks are complete. Resume export is ready." : `${Object.values(this.state.reviewChecklist).filter(Boolean).length} of 4 review checks complete.`;
    return this.snapshot();
  }
  exportReadiness(): { label: string; nextStep: string } {
    if (!this.state.resumeText) return { label: "Resume assembly required", nextStep: "Assemble the recruiter resume." };
    if (this.state.matchScore === null) return { label: "Job-match review required", nextStep: "Run the governed match review." };
    const completed = Object.values(this.state.reviewChecklist).filter(Boolean).length;
    if (completed < 4) return { label: `${completed} of 4 review checks complete`, nextStep: "Complete the remaining human-review checks." };
    return { label: "Ready for user-controlled export", nextStep: "Copy, print, or download the reviewed resume." };
  }
  exportSession(): PrivateMvpUiState { this.state.sessionExport = this.runtime.exportSession(); this.state.statusMessage = "Session export prepared. It contains the currently certified evidence and components."; return this.snapshot(); }
}
