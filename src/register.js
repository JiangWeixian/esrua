const addHook = require('pirates').addHook
const pc = require('picocolors')

const argv = require('yargs-parser')(process.argv.slice(2), { array: 'p' })

const scriptFilename = process.argv[1]
const funcName = argv._[0]
const params = argv.p

addHook(
  (code) => {
    if (!funcName) {
      console.error(`Ops, Try run ${pc.green('esrua [filepath] [function]')}`)
      return code
    }
    const stringfiedParams = JSON.stringify(params || [])
    return `${code}  ${funcName}(...JSON.parse('${stringfiedParams}'))`
  },
  { exts: ['.ts', '.tsx', '.js', '.jsx'], matcher: (filename) => filename === scriptFilename },
)
