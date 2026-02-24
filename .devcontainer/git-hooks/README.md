# Git Hooks Setup for DevContainer

This directory contains sample Git hook files for this project.

## Before Setup: Check for Existing Hooks

If you're migrating from Husky or have existing Git hooks:

```bash
# Check Git config for hooks path (should be empty)
git config core.hooksPath

# If it shows ".husky" or other path, remove it:
git config --unset core.hooksPath

# Check for existing hooks in .git/hooks/
ls -la .git/hooks/
```

## Quick Setup

```bash
# Copy hook files to .git/hooks/
cp .devcontainer/git-hooks/pre-commit.sample .git/hooks/pre-commit
cp .devcontainer/git-hooks/pre-push.sample .git/hooks/pre-push

# Make executable
chmod +x .git/hooks/pre-commit .git/hooks/pre-push
```

## What the Hooks Do

- **pre-commit**: Collects staged file paths on host, passes them as arguments to Biome formatter in DevContainer, then re-stages formatted files
- **pre-push**: Runs Biome CI checks and tests (in DevContainer)

## Testing

### Test pre-commit hook:

```bash
# Create a test file with bad formatting
cat > test.js << 'EOF'
function   test(  ){const x=1;return x;}
EOF

# Stage and commit
git add test.js
git commit -m "Test"

# Verify formatted content was committed
git show HEAD:test.js
```

### Test pre-push hook:

```bash
# This will run CI checks and tests
git push origin HEAD
```

## Notes

- These hooks run npm commands inside the DevContainer
- Each developer must set up hooks manually (`.git/hooks/` is not tracked by git)
- Hooks require DevContainer to be running or will start it automatically
