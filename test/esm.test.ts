import execa from 'execa'

const cwd = process.cwd()

describe('esm', () => {
  it('support pass function params', async () => {
    const { stdout } = await execa('node', [
      '--experimental-loader',
      `${cwd}/src/loader.mjs`,
      `${cwd}/test/test.ts`,
      'welcome',
      '-p',
      'world',
    ])
    console.log(stdout)
  })
})
