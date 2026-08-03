import {execFileSync} from "node:child_process";
import {copyFile, mkdir, rename, rm, stat, writeFile} from "node:fs/promises";
import {dirname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {bundle} from "@remotion/bundler";
import {renderMedia, renderStill, selectComposition} from "@remotion/renderer";
import {loadInfographicData} from "./validate-content";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const rendererDirectory = resolve(scriptDirectory, "..");
const entryPoint = join(rendererDirectory, "src/index.ts");
const maxPublishBytes = 5 * 1024 * 1024;

const formatMegabytes = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

const optimizeGif = ({input, output, fps, colors}: {input: string; output: string; fps: number; colors: number}) => {
  execFileSync(
    "ffmpeg",
    [
      "-v",
      "error",
      "-y",
      "-i",
      input,
      "-filter_complex",
      `[0:v]fps=${fps},split[s0][s1];[s0]palettegen=max_colors=${colors}:reserve_transparent=0:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle`,
      "-loop",
      "0",
      output,
    ],
    {stdio: "inherit"},
  );
};

const probeGif = (path: string) => {
  const output = execFileSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height,nb_frames,avg_frame_rate,duration",
      "-of",
      "json",
      path,
    ],
    {encoding: "utf8"},
  );

  return JSON.parse(output) as {
    streams: Array<{
      width: number;
      height: number;
      nb_frames: string;
      avg_frame_rate: string;
      duration: string;
    }>;
  };
};

const render = async () => {
  const inputPath = process.argv[2];
  if (!inputPath) {
    throw new Error("Usage: npm run render -- <content.json> [output-directory]");
  }

  const {absolutePath, data} = await loadInfographicData(inputPath);
  const outputDirectory = resolve(process.argv[3] ?? join(rendererDirectory, "dist", data.slug));
  await mkdir(outputDirectory, {recursive: true});

  console.log(`Bundling ${data.slug}…`);
  const serveUrl = await bundle({
    entryPoint,
    onProgress: (progress) => {
      if (progress === 1) console.log("Bundle ready.");
    },
  });

  const inputProps = data as unknown as Record<string, unknown>;
  const animatedComposition = await selectComposition({
    serveUrl,
    id: "LinkedInInfographic",
    inputProps,
    logLevel: "warn",
  });
  const coverComposition = await selectComposition({
    serveUrl,
    id: "LinkedInInfographicCover",
    inputProps,
    logLevel: "warn",
  });

  const rawGif = join(outputDirectory, `${data.slug}.raw.gif`);
  const gif = join(outputDirectory, `${data.slug}.gif`);
  const cover = join(outputDirectory, `${data.slug}.cover.png`);
  const content = join(outputDirectory, `${data.slug}.content.json`);
  const caption = join(outputDirectory, `${data.slug}.caption.md`);
  const reportPath = join(outputDirectory, `${data.slug}.report.json`);

  console.log("Rendering animated infographic…");
  await renderMedia({
    composition: animatedComposition,
    serveUrl,
    codec: "gif",
    outputLocation: rawGif,
    inputProps,
    imageFormat: "png",
    numberOfGifLoops: null,
    overwrite: true,
    concurrency: 4,
    logLevel: "warn",
  });

  console.log("Rendering static cover…");
  await renderStill({
    composition: coverComposition,
    serveUrl,
    output: cover,
    inputProps,
    imageFormat: "png",
    overwrite: true,
    logLevel: "warn",
  });

  console.log("Optimizing GIF for the LinkedIn feed…");
  optimizeGif({input: rawGif, output: gif, fps: 12, colors: 128});
  let gifStats = await stat(gif);

  if (gifStats.size > maxPublishBytes) {
    const compactGif = join(outputDirectory, `${data.slug}.compact.gif`);
    optimizeGif({input: rawGif, output: compactGif, fps: 10, colors: 96});
    const compactStats = await stat(compactGif);
    if (compactStats.size < gifStats.size) {
      await rm(gif);
      await rename(compactGif, gif);
      gifStats = compactStats;
    } else {
      await rm(compactGif);
    }
  }

  await rm(rawGif);
  await copyFile(absolutePath, content);
  await writeFile(caption, `${data.caption.trim()}\n`, "utf8");

  const probe = probeGif(gif);
  const stream = probe.streams[0];
  const report = {
    slug: data.slug,
    generatedAt: new Date().toISOString(),
    dimensions: `${stream.width}x${stream.height}`,
    durationSeconds: Number(stream.duration),
    frames: Number(stream.nb_frames),
    averageFrameRate: stream.avg_frame_rate,
    gifBytes: gifStats.size,
    gifMegabytes: Number((gifStats.size / 1024 / 1024).toFixed(2)),
    publishChecks: {
      schema: "passed",
      dimensions: stream.width === 800 && stream.height === 1000 ? "passed" : "failed",
      fileSizeTarget: gifStats.size <= maxPublishBytes ? "passed" : "failed",
      loop: "infinite",
    },
  };
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  if (report.publishChecks.dimensions === "failed") {
    throw new Error(`Unexpected GIF dimensions: ${report.dimensions}`);
  }
  if (report.publishChecks.fileSizeTarget === "failed") {
    throw new Error(`GIF is ${formatMegabytes(gifStats.size)}; reduce copy or motion before publishing.`);
  }

  console.log(`✓ GIF: ${gif} (${formatMegabytes(gifStats.size)})`);
  console.log(`✓ Cover: ${cover}`);
  console.log(`✓ Caption: ${caption}`);
  console.log(`✓ Report: ${reportPath}`);
};

render().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});
