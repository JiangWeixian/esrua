#!/usr/bin/env node

import spawn from 'cross-spawn'
import { resolve } from 'import-meta-resolve'
import { fileURLToPath } from 'url'
const spawnSync = spawn.sync

const argv = process.argv.slice(2)
Promise.resolve().then(async () => {
  const runLoader = await resolve('./loader.mjs', import.meta.url)
  const esmLoader = await resolve('@esbuild-kit/esm-loader', import.meta.url)
  const suppressWarnings = await resolve('./suppress-warnings.js', import.meta.url)
  process.exit(
    spawnSync(
      'node',
      [
        '-r',
        fileURLToPath(suppressWarnings),
        '--loader',
        runLoader,
        '--loader',
        esmLoader,
        ...argv,
      ],
      { stdio: 'inherit' },
    ).status,
  )
})
