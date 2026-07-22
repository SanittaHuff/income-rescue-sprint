export type FourScreenId = "evidence" | "component" | "review" | "trace";

export interface FourScreenState {
  activeScreen: FourScreenId;
  evidenceText: string;
  evidenceSource: string;
  componentText: string;
  evidenceVerified: boolean;
  truthGatePassed: boolean;
  qaPassed: boolean;
  certified: boolean;
  message: string;
}

export const initialFourScreenState = (): FourScreenState => ({
  activeScreen: "evidence",
  evidenceText: "",
  evidenceSource: "",
  componentText: "",
  evidenceVerified: false,
  truthGatePassed: false,
  qaPassed: false,
  certified: false,
  message: "Add one genuine experience and where it came from.",
});

export const validateEvidenceScreen = (state: FourScreenState): string[] => {
  const errors: string[] = [];
  if (!state.evidenceText.trim()) errors.push("Add the experience or fact you want to preserve.");
  if (!state.evidenceSource.trim()) errors.push("Add where this information came from.");
  return errors;
};

export const assessClaimSupport = (evidenceText: string, componentText: string): boolean => {
  const evidenceWords = new Set(evidenceText.toLowerCase().split(/\W+/).filter((word) => word.length > 3));
  return componentText.toLowerCase().split(/\W+/).some((word) => evidenceWords.has(word));
};

export const recoveryOptions = [
  "Upload supporting evidence",
  "Search historical resume documents",
  "Search my email evidence",
  "Search similar job descriptions for memory support only",
  "Show the highest-ROI next step",
] as const;
