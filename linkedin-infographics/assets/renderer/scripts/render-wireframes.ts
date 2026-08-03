import {mkdir} from "node:fs/promises";
import {dirname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const rendererDirectory = resolve(scriptDirectory, "..");
const output = resolve(process.argv[2] ?? join(rendererDirectory, "..", "layout-wireframes.png"));

const run = async () => {
  await mkdir(dirname(output), {recursive: true});
  const serveUrl = await bundle({entryPoint: join(rendererDirectory, "src/index.ts")});
  const composition = await selectComposition({serveUrl, id: "LayoutWireframes", logLevel: "warn"});
  await renderStill({
    composition,
    serveUrl,
    output,
    imageFormat: "png",
    overwrite: true,
    logLevel: "warn",
  });
  console.log(`✓ Layout wireframes: ${output}`);
};

run().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
