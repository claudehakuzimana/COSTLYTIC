#!/bin/bash

# Database restore script

if [ -z "$1" ]; then
  echo "Usage: ./restore.sh <backup-file>"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "📥 Restoring from backup: $BACKUP_FILE"

# Restore MongoDB
mongorestore --uri="$MONGO_URI" --archive="$BACKUP_FILE" --gzip

if [ $? -eq 0 ]; then
  echo "✅ Restore completed successfully!"
else
  echo "❌ Restore failed!"
  exit 1
fi
