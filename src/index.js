#!/usr/bin/env node

const spawn = require('cross-spawn')
const spawnSync = spawn.sync
const fs = require('fs')

const register = require.resolve('esbuild-register')
const runFunc = require.resolve('./register.js')

const DEFAULT_ENTRY = './index.ts'

const argv = process.argv.slice(2)

if (!fs.existsSync(argv[0])) {
  argv.unshift(DEFAULT_ENTRY)
}

process.exit(
  spawnSync('node', ['-r', register, '-r', runFunc, ...argv], { stdio: 'inherit' }).status,
)
