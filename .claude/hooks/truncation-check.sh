#!/usr/bin/env bash
# truncation-check.sh — PostToolUse on Grep|Bash|Read. Advisory only; never blocks.
# Source: Software Engineering Core / core-rules / hooks.md
#
# Contract:
#   - Triggers when tool_response length ≥ 50,000 chars OR contains a
#     "...truncated..." / "Output too large" marker.
#   - Returns {"additionalContext": "..."} for Claude's awareness.
#   - Always exit 0. Advisory only — the tool already ran.
#
# Dependencies: jq (required).
#
# Base: github.com/iamfakeguru/claude-md (MIT). Spec alignment:
#   - Explicit 50,000-char threshold per our hooks.md.
#   - Kept upstream's low-result-count grep heuristic as a bonus signal.

set -u

INPUT=$(cat)

if ! command -v jq >/dev/null 2>&1; then
  if [ "${SE_CORE_NO_JQ_DEGRADE:-0}" = "1" ]; then
    echo "truncation-check: jq not found; SE_CORE_NO_JQ_DEGRADE=1 — degrading to no-op (install jq: brew install jq | apt-get install -y jq)" >&2
    exit 0
  fi
  echo "truncation-check: jq required but not found — install jq (brew install jq | apt-get install -y jq) or set SE_CORE_NO_JQ_DEGRADE=1 to allow degradation" >&2
  exit 1
fi

TOOL_NAME=$(printf '%s' "$INPUT" | jq -r '.tool_name // empty')

# Normalize tool_response to a string regardless of shape.
TOOL_RESPONSE=$(printf '%s' "$INPUT" | jq -r '
  if (.tool_response | type) == "string" then .tool_response
  elif (.tool_response | type) == "object" then (.tool_response | tostring)
  else ""
  end
')

emit_advisory() {
  local msg="$1"
  jq -nc --arg msg "$msg" '{additionalContext: $msg}'
}

# 1) Explicit truncation markers.
if printf '%s' "$TOOL_RESPONSE" | grep -qE '\.\.\.truncated\.\.\.|Output too large|truncated output|\[truncated\]'; then
  emit_advisory "Result was truncated. Re-run with narrower scope or read the source file directly."
  exit 0
fi

# 2) ≥ 50,000 chars → treat as effective truncation.
RESP_LEN=${#TOOL_RESPONSE}
if [ "$RESP_LEN" -ge 50000 ]; then
  emit_advisory "Result is large (${RESP_LEN} chars, ≥50K). Narrow the scope or read specific files/ranges instead of scanning broadly."
  exit 0
fi

# 3) Bonus heuristic (upstream): grep returning ~0 results for a specific pattern.
if [ "$TOOL_NAME" = "Grep" ]; then
  RESULT_COUNT=$(printf '%s\n' "$TOOL_RESPONSE" | grep -c '^' 2>/dev/null || echo 0)
  PATTERN=$(printf '%s' "$INPUT" | jq -r '.tool_input.pattern // empty')
  if [ -n "$PATTERN" ] && [ "$RESULT_COUNT" -lt 5 ]; then
    emit_advisory "Low result count (${RESULT_COUNT}) for pattern '${PATTERN}'. If you expected more, the result may have been filtered; try a broader pattern or a different path."
    exit 0
  fi
fi

exit 0
