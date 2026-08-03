---
name: linkedin-infographics
description: Turn a topic, LinkedIn post, URL, transcript, rough notes, or wall of text into a publish-ready animated LinkedIn infographic. Use when an agent needs to distill source material, create a structured five-step visual story, render an 800x1000 looping GIF and static cover, write the companion LinkedIn caption, or validate infographic dimensions, filesize, and copy budgets.
---

# LinkedIn Infographics

Choose a visual structure, build a structured content file, then use the bundled deterministic renderer. Keep editorial judgment flexible and production rules strict.

## Compatibility

This skill uses the portable `SKILL.md` folder format and can run in both Codex and Claude Code. Keep the full directory together so the renderer, scripts, references, and assets remain available to either agent.

## Workflow

1. Read the user's source only far enough to identify its content relationship: sequence, transformation, central framework, or editorial evidence.
2. Read [references/layout-archetypes.md](references/layout-archetypes.md).
3. Show `assets/layout-wireframes.png`, recommend the strongest two options, and ask the user to choose A, B, C, or D. Stop before drafting final copy or rendering. Do not silently reuse the previous post's layout.
4. After the user chooses, map it to the renderer ID (`A=journey-rail`, `B=split-engine`, `C=orbit-map`, `D=editorial-stack`), record it in the working brief, and read [references/content-contract.md](references/content-contract.md).
5. Copy `assets/renderer/examples/meta-linkedin-infographics.json` to the user's working directory and replace its content. Preserve every key, set `layout` to the approved renderer ID, and use exactly five high-level steps.
6. Validate claims against the provided source. Ask for evidence only when an unsupported claim materially changes the post; otherwise remove or qualify it.
7. Render with:

   ```bash
   bash scripts/render-infographic.sh /absolute/path/content.json /absolute/path/output-directory
   ```

8. Inspect the PNG cover at full resolution. Inspect the GIF at its beginning, midpoint, and end.
9. Read the generated report. Treat any failed check as blocking. Rewrite copy instead of weakening the schema or reducing legibility.
10. Return links to the GIF, cover, caption, content JSON, and report.

## Editing the visual system

Read [references/design-system.md](references/design-system.md) before changing layout, typography, color, animation, duration, or export settings. Preserve the 800x1000 canvas and the distinction between flexible content generation and deterministic rendering.

Use Remotion Studio for visual editing:

```bash
cd assets/renderer
npm install
npm run studio
```

Drive all animation from Remotion frames. Do not use CSS transitions or CSS keyframe animations.

## Output contract

Produce these files for each infographic:

- `<slug>.gif`: infinitely looping LinkedIn asset.
- `<slug>.cover.png`: static first-image alternative and preview.
- `<slug>.content.json`: editable source of truth.
- `<slug>.caption.md`: companion post copy.
- `<slug>.report.json`: dimensions, frames, duration, filesize, and publish checks.

Do not post to LinkedIn without explicit user approval.
