import execa from 'execa'

describe('index', () => {
  it.todo('support pass function params')
  it.todo('support no function params')
  it('esrua default entry is index.ts', async () => {
    const { stdout } = await execa('node', [`${process.cwd()}/src/index.js`, 'welcome'])
    expect(stdout).toBe('hello undefined')
  })
})
