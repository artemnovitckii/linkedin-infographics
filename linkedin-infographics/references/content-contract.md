# Content contract

Use this contract when converting a topic, post, transcript, URL, or rough notes into renderer input.

Set `layout` to the approved archetype ID: `journey-rail`, `split-engine`, `orbit-map`, or `editorial-stack`. Never change it after approval without showing a new wireframe.

## Editorial spine

1. Write one concrete promise. Avoid vague titles such as “The future of AI.”
2. Select exactly five high-level beats that move from input to useful outcome.
3. Make every step perform a different job; remove restatements.
4. Preserve facts from the source. Mark unsupported numbers for user review instead of inventing evidence.
5. Prefer verbs, concrete nouns, and operational details.

## Copy budgets

- `titleLead`: 24 characters maximum.
- `titleAccent`: 30 characters maximum.
- `subtitle`: 70 characters maximum.
- Optional compatibility label: 18 characters maximum. Only show supported tools that genuinely run the workflow.
- Optional author signature: name, short label, public plug, and a bundled avatar path.
- Each step title: 36 characters maximum.
- Each step description: 112 characters maximum and normally one sentence.
- Each step output chip: 18 characters maximum.
- `cta`: 18 characters maximum and one action only.
- Use `footerMode: conversion` when the post offers a skill or resource. Use `metrics` for proof-led educational posts.
- Use exactly three compact proof or production metrics.

The Zod schema in `assets/renderer/src/schema.ts` enforces these limits. Do not weaken it to force oversized copy into a layout. Rewrite the copy instead.

## Visual assignment

Assign each step one supported `visual` value:

- `source`: topics, notes, posts, transcripts, or other raw material.
- `story`: hooks, structure, sequencing, or editorial decisions.
- `layout`: comparing and selecting visual structures or wireframes.
- `template`: reusable layouts or visual-system selection.
- `motion`: animation, timing, or guided reading order.
- `export`: finished files, packaging, or publishing readiness.

## Caption

Write the caption after the infographic. Use this order:

1. Personal or observational hook.
2. The problem that triggered the system.
3. The core mechanism in plain language.
4. A short output list.
5. One honest call to action.

Write the hook last, then place it first. Keep it to one or two short lines and lead with tension, novelty, a concrete result, or surprising proof. Avoid slow setup such as “I have been experimenting,” “I wanted to share,” or “Here is how.” The opening must create immediate curiosity while accurately matching the post; never trade credibility for hype.

For Artem's captions, match the voice demonstrated in his published posts:

- Open with a short, opinionated claim or a specific firsthand result.
- Follow the hook with concrete proof, then explain why the result matters.
- Write conversationally in first person, using short paragraphs and plain language.
- Let sentences begin with “And,” “But,” or “So” when it makes the rhythm feel natural.
- Use British spelling and occasional dry self-awareness; avoid corporate or motivational language.
- For build or resource announcements, prefer result → attached proof → name and compatibility → mechanism → capabilities → final package → CTA. Do not force a pain-point story when the build itself is the hook.
- Use a compact unnumbered list for capabilities; bullets or arrows are optional.
- End resource posts with one low-friction keyword comment CTA, followed only by a brief connection reminder when delivery requires it.

Keep the caption readable without the image. Do not claim checks or outputs that the renderer does not produce.

Do not add URLs, newsletter links, or author plugs to the caption unless the user explicitly requests a link. Keep any author plug inside the infographic's visual signature instead.
