#!/usr/bin/env bash
set -euo pipefail

skill_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
renderer_dir="$skill_dir/assets/renderer"

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "Usage: $0 <content.json> [output-directory]" >&2
  exit 1
fi

input_path="$1"
if [[ "$input_path" != /* ]]; then
  input_path="$(pwd)/$input_path"
fi

if [[ $# -eq 2 ]]; then
  output_path="$2"
  if [[ "$output_path" != /* ]]; then
    output_path="$(pwd)/$output_path"
  fi
else
  output_path="$(pwd)/output"
fi

if [[ ! -d "$renderer_dir/node_modules" ]]; then
  npm ci --prefix "$renderer_dir"
fi

npm --prefix "$renderer_dir" run render -- "$input_path" "$output_path"
