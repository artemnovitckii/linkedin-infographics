import {z} from "zod";

const stepSchema = z.object({
  phase: z.string().min(2).max(14),
  title: z.string().min(4).max(36),
  description: z.string().min(18).max(112),
  output: z.string().min(2).max(18),
  visual: z.enum(["source", "story", "layout", "template", "motion", "export"]),
});

const metricSchema = z.object({
  value: z.string().min(1).max(12),
  label: z.string().min(2).max(24),
});

const compatibilitySchema = z.object({
  label: z.string().min(4).max(18),
  tools: z.array(z.enum(["claude-code", "codex"])).length(2),
});

const authorSchema = z.object({
  name: z.string().min(2).max(32),
  label: z.string().min(2).max(16),
  plug: z.string().min(3).max(40),
  avatar: z.string().min(3).max(100),
});

export const infographicSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).max(64),
  layout: z.enum(["journey-rail", "split-engine", "orbit-map", "editorial-stack"]),
  eyebrow: z.string().min(3).max(30),
  titleLead: z.string().min(4).max(24),
  titleAccent: z.string().min(5).max(30),
  subtitle: z.string().min(12).max(70),
  inputLabel: z.string().min(2).max(18),
  inputTags: z.array(z.string().min(2).max(15)).min(2).max(4),
  outputLabel: z.string().min(2).max(20),
  compatibility: compatibilitySchema.optional(),
  author: authorSchema.optional(),
  steps: z.array(stepSchema).length(5),
  metrics: z.array(metricSchema).length(3),
  footerLeft: z.string().min(3).max(32),
  footerRight: z.string().min(3).max(24),
  cta: z.string().min(3).max(18).default("SAVE ↓"),
  footerMode: z.enum(["metrics", "conversion"]).default("metrics"),
  caption: z.string().min(40).max(2600),
});

export type InfographicProps = z.infer<typeof infographicSchema>;
