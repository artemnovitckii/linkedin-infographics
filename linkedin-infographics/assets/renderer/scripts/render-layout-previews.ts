import {execFileSync} from "node:child_process";
import {mkdir, readFile} from "node:fs/promises";
import {dirname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import {infographicSchema, type InfographicProps} from "../src/schema";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const rendererDirectory = resolve(scriptDirectory, "..");
const outputDirectory = resolve(process.argv[2] ?? join(rendererDirectory, "dist", "layout-previews"));
const layouts: InfographicProps["layout"][] = ["journey-rail", "split-engine", "orbit-map", "editorial-stack"];

const run = async () => {
  const source = JSON.parse(await readFile(join(rendererDirectory, "examples/meta-linkedin-infographics.json"), "utf8"));
  await mkdir(outputDirectory, {recursive: true});
  const serveUrl = await bundle({entryPoint: join(rendererDirectory, "src/index.ts")});
  const outputs: string[] = [];

  for (const layout of layouts) {
    const data = infographicSchema.parse({...source, layout});
    const inputProps = data as unknown as Record<string, unknown>;
    const composition = await selectComposition({serveUrl, id: "LinkedInInfographicCover", inputProps, logLevel: "warn"});
    const output = join(outputDirectory, `${layout}.png`);
    await renderStill({composition, serveUrl, output, inputProps, imageFormat: "png", overwrite: true, logLevel: "warn"});
    outputs.push(output);
  }

  const contactSheet = join(outputDirectory, "populated-layouts.png");
  execFileSync(
    "ffmpeg",
    [
      "-v", "error", "-y",
      ...outputs.flatMap((output) => ["-i", output]),
      "-filter_complex",
      "[0:v]scale=400:500[a];[1:v]scale=400:500[b];[2:v]scale=400:500[c];[3:v]scale=400:500[d];[a][b][c][d]xstack=inputs=4:layout=0_0|400_0|0_500|400_500[out]",
      "-map", "[out]",
      "-frames:v", "1",
      contactSheet,
    ],
    {stdio: "inherit"},
  );

  console.log(`✓ Populated layout previews: ${contactSheet}`);
};

run().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
