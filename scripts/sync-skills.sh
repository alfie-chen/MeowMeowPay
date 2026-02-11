#!/bin/bash
# Sync .claude/skills/ → .agents/skills/ in real-time using fswatch
#
# Usage:
#   ./scripts/sync-skills.sh        # Start watching (foreground)
#   ./scripts/sync-skills.sh once   # Run one-time sync only

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$PROJECT_DIR/.claude/skills/"
DEST="$PROJECT_DIR/.agents/skills/"

sync_skills() {
    rsync -av --delete "$SRC" "$DEST" --exclude='.DS_Store'
    echo "[$(date '+%H:%M:%S')] Synced .claude/skills/ → .agents/skills/"
}

# Initial sync
sync_skills

# If "once" argument, exit after initial sync
if [ "$1" = "once" ]; then
    exit 0
fi

echo "Watching for changes in $SRC ..."
echo "Press Ctrl+C to stop."

fswatch -o "$SRC" | while read -r _; do
    sync_skills
done
