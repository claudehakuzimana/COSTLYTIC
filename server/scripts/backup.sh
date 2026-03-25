#!/bin/bash

# Database backup script

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/mongodb_backup_$TIMESTAMP.tar.gz"

mkdir -p "$BACKUP_DIR"

echo "📦 Starting MongoDB backup..."

# Backup MongoDB
mongodump --uri="$MONGO_URI" --archive="$BACKUP_FILE" --gzip

if [ $? -eq 0 ]; then
  echo "✅ Backup completed: $BACKUP_FILE"
else
  echo "❌ Backup failed!"
  exit 1
fi
