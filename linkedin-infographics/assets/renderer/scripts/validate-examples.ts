import {readdir} from "node:fs/promises";
import {dirname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {loadInfographicData} from "./validate-content";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const examplesDirectory = resolve(scriptDirectory, "../examples");

const validateExamples = async () => {
  const files = (await readdir(examplesDirectory))
    .filter((file) => file.endsWith(".json"))
    .sort();

  if (files.length === 0) {
    throw new Error(`No JSON examples found in ${examplesDirectory}`);
  }

  const slugs = new Set<string>();

  for (const file of files) {
    const {data} = await loadInfographicData(join(examplesDirectory, file));
    if (slugs.has(data.slug)) {
      throw new Error(`Duplicate example slug: ${data.slug}`);
    }
    slugs.add(data.slug);
    console.log(`✓ ${file} · ${data.layout}`);
  }

  console.log(`✓ ${files.length} renderer examples passed`);
};

validateExamples().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
