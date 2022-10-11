import execa from 'execa'
import { describe, it, expect } from 'vitest'

const cwd = process.cwd()

describe('esm', () => {
  it('support pass function params', async () => {
    const { stdout } = await execa('node', [
      `${cwd}/src/index.mjs`,
      `${cwd}/test/test.ts`,
      'welcome',
      '-p',
      'world',
    ])
    expect(stdout).toBe('hello world')
  })
})
