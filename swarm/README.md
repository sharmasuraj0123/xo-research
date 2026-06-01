# XO Swarm CLI

Lightweight folder-scoped swarm with two agents:

- `x`: coverage and expansion
- `o`: cleanup and structure

## Why this design

- tiny shell scripts
- no heavy runtime required
- strict folder boundaries by config and prompt contract
- fast trigger from one command

## Files

- `swarm/xo-swarm.sh`: dispatcher
- `swarm/agents.env`: agent-folder mapping
- `swarm/prompts/x.md`: X behavior prompt
- `swarm/prompts/o.md`: O behavior prompt
- `swarm/runners/local-runner.sh`: default local runner contract
- `swarm/logs/`: run envelopes and logs

## Run

```bash
# run both agents
./swarm/xo-swarm.sh all "scan and report"

# run one agent
./swarm/xo-swarm.sh x "summarize missing docs"
./swarm/xo-swarm.sh o "propose cleanup"
```

## Runner contract

The dispatcher calls:

```bash
runner <agent_name> <folder_abs> <prompt_file> <task> <log_file>
```

Set a custom runner:

```bash
XO_SWARM_RUNNER=./swarm/runners/local-runner.sh ./swarm/xo-swarm.sh all "my task"
```

`local-runner.sh` currently writes run envelopes and scope contract to logs.
Replace the commented line in it with your actual Cursor agent CLI command.

## Scope enforcement

Every run includes:

- fixed folder per agent from `agents.env`
- explicit scope contract in the run envelope
- isolated working directory expectation in your runner

For stricter enforcement, run each agent in its own sparse worktree rooted at target folder.
