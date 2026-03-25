#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const scripts = {
  deploy: 'bash scripts/deploy.sh',
  backup: 'bash scripts/backup.sh',
  restore: 'bash scripts/restore.sh',
  migrate: 'bash scripts/migrate.sh',
  seed: 'npm run seed'
};

const command = process.argv[2];

if (!command || !scripts[command]) {
  console.log('📋 Available commands:');
  Object.keys(scripts).forEach(cmd => {
    console.log(`   npm run ${cmd}`);
  });
  process.exit(0);
}

console.log(`🚀 Running: ${scripts[command]}`);

const child = spawn('bash', ['-c', scripts[command]], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code);
});
