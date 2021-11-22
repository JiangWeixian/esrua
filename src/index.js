#!/usr/bin/env node

const spawn = require('cross-spawn')
const spawnSync = spawn.sync

const register = require.resolve('esbuild-register')
const runFunc = require.resolve('./register.js')

const argv = process.argv.slice(2)

process.exit(
  spawnSync('node', ['-r', register, '-r', runFunc, ...argv], { stdio: 'inherit' }).status,
)
