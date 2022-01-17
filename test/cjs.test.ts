import execa from 'execa'

describe('cjs', () => {
  it('support pass function params', async () => {
    const { stdout } = await execa('node', [
      `${process.cwd()}/src/index.js`,
      'welcome',
      '-p',
      'world',
    ])
    expect(stdout).toBe('hello world')
  })
  it('support define filepath', async () => {
    const { stdout } = await execa('node', [
      `${process.cwd()}/src/index.js`,
      `${process.cwd()}/test/test.ts`,
      'welcome',
    ])
    expect(stdout).toBe('hello undefined')
  })
  it('esrua default entry is index.ts', async () => {
    const { stdout } = await execa('node', [`${process.cwd()}/src/index.js`, 'welcome'])
    expect(stdout).toBe('hello undefined')
  })
})
