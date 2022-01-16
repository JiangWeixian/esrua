#!/usr/bin/env node

import spawn from 'cross-spawn'
import { resolve } from 'import-meta-resolve'
const spawnSync = spawn.sync

const argv = process.argv.slice(2)
resolve('./loader.mjs', import.meta.url).then((path) => {
  // TODO: remove debug console in major version
  console.log(path)
  process.exit(spawnSync('node', ['--loader', path, ...argv], { stdio: 'inherit' }).status)
})
