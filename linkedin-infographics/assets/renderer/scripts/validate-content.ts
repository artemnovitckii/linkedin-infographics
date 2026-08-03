import {readFile} from "node:fs/promises";
import {resolve} from "node:path";
import {infographicSchema} from "../src/schema";

export const loadInfographicData = async (inputPath: string) => {
  const absolutePath = resolve(inputPath);
  const raw = await readFile(absolutePath, "utf8");
  const parsed = infographicSchema.safeParse(JSON.parse(raw));

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `- ${issue.path.join(".") || "root"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Content validation failed:\n${issues}`);
  }

  const titles = parsed.data.steps.map((step) => step.title.toLowerCase());
  if (new Set(titles).size !== titles.length) {
    throw new Error("Content validation failed: every step title must be unique.");
  }

  return {absolutePath, data: parsed.data};
};

const runFromCli = async () => {
  const inputPath = process.argv[2];
  if (!inputPath) {
    throw new Error("Usage: tsx scripts/validate-content.ts <content.json>");
  }

  const {data} = await loadInfographicData(inputPath);
  const characterCount = data.steps.reduce(
    (total, step) => total + step.title.length + step.description.length,
    0,
  );

  console.log(`✓ ${data.slug}`);
  console.log(`✓ ${data.steps.length} steps / ${characterCount} body characters`);
  console.log("✓ copy budgets and required fields passed");
};

if (import.meta.url === `file://${process.argv[1]}`) {
  runFromCli().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
