---
name: dev-server-lifecycle
description: Start and stop the demo-showcase dev server inside DevContainer. Use when launching, stopping, or troubleshooting the dev server.
---

# Dev Server Lifecycle

## Start

```bash
devcontainer exec --workspace-folder . pnpm run dev
```

Runs on container port 3456 (mapped to a dynamic host port on `127.0.0.1` via `-p 127.0.0.1:0:3456`).

### Discover Host Port

The container name includes the `devcontainerId` of the folder. Read it by its label, then write the name literally in the next command:

```bash
docker ps --filter label=devcontainer.local_folder=<absolute workspace path> --format '{{.Names}}'
docker port <container> 3456
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
docker stop <container>
devcontainer up --workspace-folder .
```
