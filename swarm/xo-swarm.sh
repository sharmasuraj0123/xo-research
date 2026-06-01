#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SWARM_DIR="$ROOT_DIR/swarm"
LOG_DIR="$SWARM_DIR/logs"
RUNNER="${XO_SWARM_RUNNER:-$SWARM_DIR/runners/local-runner.sh}"

if [[ ! -f "$SWARM_DIR/agents.env" ]]; then
  echo "Missing config: $SWARM_DIR/agents.env"
  exit 1
fi

# shellcheck source=/dev/null
source "$SWARM_DIR/agents.env"
mkdir -p "$LOG_DIR"

usage() {
  cat <<'EOF'
Usage:
  ./swarm/xo-swarm.sh [x|o|all] [task...]

Examples:
  ./swarm/xo-swarm.sh all "summarize folder status"
  ./swarm/xo-swarm.sh x "update docs map"

Notes:
  - Set XO_SWARM_RUNNER to your own runner script.
  - Runner contract: runner <agent_name> <folder_abs> <prompt_file> <task> <log_file>
EOF
}

resolve_agent_folder() {
  local agent="$1"
  case "$agent" in
    x) echo "${XO_AGENT_X_FOLDER:-}" ;;
    o) echo "${XO_AGENT_O_FOLDER:-}" ;;
    *) return 1 ;;
  esac
}

resolve_agent_prompt() {
  local agent="$1"
  case "$agent" in
    x) echo "${XO_AGENT_X_PROMPT:-}" ;;
    o) echo "${XO_AGENT_O_PROMPT:-}" ;;
    *) return 1 ;;
  esac
}

run_one() {
  local agent="$1"
  local task="$2"

  local folder_rel
  folder_rel="$(resolve_agent_folder "$agent")"
  local prompt_rel
  prompt_rel="$(resolve_agent_prompt "$agent")"

  if [[ -z "${folder_rel:-}" || -z "${prompt_rel:-}" ]]; then
    echo "Agent config missing for '$agent'"
    exit 1
  fi

  local folder_abs="$ROOT_DIR/$folder_rel"
  local prompt_file="$ROOT_DIR/$prompt_rel"
  local timestamp
  timestamp="$(date +%Y%m%d-%H%M%S)"
  local log_file="$LOG_DIR/${timestamp}-${agent}.log"

  if [[ ! -d "$folder_abs" ]]; then
    echo "Folder not found for $agent: $folder_abs"
    exit 1
  fi

  if [[ ! -f "$prompt_file" ]]; then
    echo "Prompt file not found for $agent: $prompt_file"
    exit 1
  fi

  if [[ ! -x "$RUNNER" ]]; then
    echo "Runner is not executable: $RUNNER"
    echo "Set XO_SWARM_RUNNER to an executable script."
    exit 1
  fi

  echo "Launching agent '$agent' in $folder_rel"
  "$RUNNER" "$agent" "$folder_abs" "$prompt_file" "$task" "$log_file" &
}

target="${1:-all}"
if [[ "$target" == "-h" || "$target" == "--help" ]]; then
  usage
  exit 0
fi
shift || true
task="${*:-scan folder and produce a concise status report}"

case "$target" in
  x)
    run_one "x" "$task"
    ;;
  o)
    run_one "o" "$task"
    ;;
  all)
    run_one "x" "$task"
    run_one "o" "$task"
    ;;
  *)
    echo "Unknown target: $target"
    usage
    exit 1
    ;;
esac

wait
echo "Swarm run complete. Logs: $LOG_DIR"
