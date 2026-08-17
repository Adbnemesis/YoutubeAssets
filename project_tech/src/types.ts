import { z } from "zod";

export const CodeLineSchema = z.object({
  number: z.number(),
  code: z.string(),
  isHighlighted: z.boolean().optional(),
  highlightType: z.enum(["bug", "fix", "focus", "normal"]).optional(),
});

export type CodeLine = z.infer<typeof CodeLineSchema>;

export const OutputOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  isCorrect: z.boolean(),
  percentageVoted: z.number().optional(), // For psychology poll overlay
});

export type OutputOption = z.infer<typeof OutputOptionSchema>;

export const OutputPredictorPropsSchema = z.object({
  id: z.string(),
  seriesTitle: z.string().default("WHAT DOES THIS PRINT?"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "FAANG INTERVIEW"]).default("MEDIUM"),
  language: z.enum(["JavaScript", "Python", "C++", "Java", "TypeScript", "Go", "Rust"]).default("JavaScript"),
  hookQuestion: z.string(),
  subHook: z.string().optional(),
  codeLines: z.array(CodeLineSchema),
  countdownSeconds: z.number().default(5),
  options: z.array(OutputOptionSchema),
  correctOptionId: z.string(),
  explanationHeading: z.string(),
  explanationPoints: z.array(z.string()),
  complexityTime: z.string().optional(),
  complexitySpace: z.string().optional(),
  callToAction: z.string().default("Save for your next interview 📌"),
  brandTag: z.string().default("@codemind.dev"),
});

export type OutputPredictorProps = z.infer<typeof OutputPredictorPropsSchema>;

export const SpotTheBugPropsSchema = z.object({
  id: z.string(),
  seriesTitle: z.string().default("SPOT THE BUG"),
  difficulty: z.enum(["JUNIOR", "SENIOR", "STAFF", "INTERVIEW TRAP"]).default("SENIOR"),
  language: z.string().default("Python"),
  hookQuestion: z.string(),
  buggyCodeLines: z.array(CodeLineSchema),
  fixedCodeLines: z.array(CodeLineSchema),
  buggyLineNumber: z.number(),
  countdownSeconds: z.number().default(5),
  bugExplanation: z.string(),
  whyItHappens: z.string(),
  callToAction: z.string().default("Did you spot it in under 5s? Drop it below 👇"),
  brandTag: z.string().default("@codemind.dev"),
});

export type SpotTheBugProps = z.infer<typeof SpotTheBugPropsSchema>;

export const AlgorithmDuelPropsSchema = z.object({
  id: z.string(),
  seriesTitle: z.string().default("ALGORITHM DUEL"),
  algorithmNameA: z.string(),
  complexityA: z.string(),
  algorithmNameB: z.string(),
  complexityB: z.string(),
  hookQuestion: z.string(),
  inputArray: z.array(z.number()),
  explanation: z.string(),
  winner: z.enum(["A", "B", "TIE"]),
  callToAction: z.string().default("Which one do you use in production?"),
  brandTag: z.string().default("@codemind.dev"),
});

export type AlgorithmDuelProps = z.infer<typeof AlgorithmDuelPropsSchema>;
