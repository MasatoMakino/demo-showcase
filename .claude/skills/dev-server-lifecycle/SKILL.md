---
name: dev-server-lifecycle
description: Start and stop the demo-showcase dev server inside DevContainer. Use when launching, stopping, or troubleshooting the dev server.
---

# Dev Server Lifecycle

## Start

```bash
devcontainer exec --workspace-folder . npm run dev
```

Runs on container port 3456 (mapped to a dynamic host port via `-p 0:3456`).

### Discover Host Port

```bash
docker port demo-showcase-npm-runner 3456
```

Access `http://localhost:<host-port>` in the host browser.

## Stop

`TaskStop` only terminates the host-side `devcontainer exec` process. Child processes inside the container survive.

### Steps

1. **Stop the background task** (if started via Bash tool with `run_in_background`):

   Use `TaskStop` with the task ID.

2. **Find remaining processes**:

   ```bash
   devcontainer exec --workspace-folder . bash -c 'for pid in /proc/[0-9]*/cmdline; do if tr "\0" " " < "$pid" 2>/dev/null | grep -q "demo-showcase\|vite"; then echo "PID=$(dirname $pid | cut -d/ -f3): $(tr "\0" " " < $pid)"; fi; done'
   ```

3. **Kill processes**:

   ```bash
   devcontainer exec --workspace-folder . bash -c 'kill <PID1> <PID2> ...'
   ```

4. **Verify** by re-running step 2 (no output = clean).

### Escalation

If processes persist:

```bash
docker stop demo-showcase-npm-runner
devcontainer up --workspace-folder .
```
