#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const distPath = path.join(__dirname, '..', 'dist', 'cli.js');
const srcPath = path.join(__dirname, '..', 'src', 'cli.ts');

if (fs.existsSync(distPath)) {
  const { runCli } = require(distPath);
  runCli(process.argv);
} else {
  // If dist doesn't exist yet, run through ts-node or transpile on the fly
  try {
    require('child_process').execSync('npx tsc', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    const { runCli } = require(distPath);
    runCli(process.argv);
  } catch (err) {
    console.error('Błąd uruchamiania xodus-heroic:', err.message);
    process.exit(1);
  }
}
