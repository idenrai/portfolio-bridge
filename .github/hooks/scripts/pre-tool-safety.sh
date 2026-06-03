#!/bin/bash
# pre-tool-safety.sh
# Blocks dangerous shell commands before they are executed by the Copilot agent.
# Receives the preToolUse JSON payload via stdin and writes a deny decision to
# stdout if a dangerous pattern is detected.
#
# Denied patterns (must be run manually by the developer):
#   - git push --force / -f
#   - git reset --hard
#   - rm -rf
#   - --no-verify  (bypasses git hooks)
#   - deletion of main branch or tag

set -euo pipefail

# Read full JSON payload from stdin
INPUT=$(cat)

# Extract the shell command from the payload.
# Handles both camelCase (toolArgs.command) and snake_case (tool_input.command) formats.
CMD=$(printf '%s' "$INPUT" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    args = data.get('toolArgs') or data.get('tool_input') or {}
    if isinstance(args, dict):
        cmd = args.get('command') or args.get('cmd') or ''
    elif isinstance(args, str):
        cmd = args
    else:
        cmd = ''
    print(cmd)
except Exception:
    print('')
" 2>/dev/null || true)

if [ -z "$CMD" ]; then
    exit 0
fi

DENY_REASON=""

# Force push
if echo "$CMD" | grep -qE 'git\s+push\s+(.*\s)?(--force|-f)(\s|$)'; then
    DENY_REASON="Force push is not allowed. Use git push without --force."

# Hard reset
elif echo "$CMD" | grep -qE 'git\s+reset\s+--hard'; then
    DENY_REASON="git reset --hard is not allowed. This destroys uncommitted changes."

# Recursive force delete (rm -rf / rm -fr / rm -Rf etc.)
elif echo "$CMD" | grep -qE 'rm\s+-[a-zA-Z]*r[a-zA-Z]*f|rm\s+-[a-zA-Z]*f[a-zA-Z]*r'; then
    DENY_REASON="rm -rf is not allowed. Use targeted file deletions instead."

# Bypass git hooks
elif echo "$CMD" | grep -qE '\-\-no-verify'; then
    DENY_REASON="Bypassing git hooks with --no-verify is not allowed."

# Delete main branch or tag
elif echo "$CMD" | grep -qE 'git\s+(branch|tag)\s+-[dD]\s+.*main'; then
    DENY_REASON="Deleting the main branch or main tag is not allowed."
fi

if [ -n "$DENY_REASON" ]; then
    printf '{"permissionDecision":"deny","permissionDecisionReason":"%s"}\n' "$DENY_REASON"
    exit 0
fi

exit 0
