#!/usr/bin/env bash
set -euo pipefail

agent_name="${1:?agent_name missing}"
folder_abs="${2:?folder_abs missing}"
prompt_file="${3:?prompt_file missing}"
task="${4:-}"
log_file="${5:?log_file missing}"

scope_contract="$(cat <<'EOF'
Scope contract:
- You are restricted to the current working directory only.
- Do not read, edit, or reference parent directories.
- If the task asks for anything outside this folder, refuse and report scope violation.
EOF
)"

{
  echo "agent=$agent_name"
  echo "folder=$folder_abs"
  echo "prompt_file=$prompt_file"
  echo "task=$task"
  echo "started_at=$(date -Iseconds)"
  echo
  cat "$prompt_file"
  echo
  echo "$scope_contract"
  echo
  echo "Task:"
  echo "$task"
} >"$log_file"

echo "[$agent_name] wrote run envelope -> $log_file"

# Replace the line below with your real CLI invocation.
# Example shape:
#   (cd "$folder_abs" && cursor-agent run --prompt-file "$log_file")
