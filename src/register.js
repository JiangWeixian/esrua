const addHook = require('pirates').addHook

const argv = require('yargs-parser')(process.argv.slice(2), { array: 'p' })

const funcName = argv._[0]
const params = argv.p

addHook(
  (code) => {
    if (!funcName) {
      console.error('Please exec script function like `esrua file function-name`')
      return code
    }
    const stringfiedParams = JSON.stringify(params || [])
    return `${code}  ${funcName}(...JSON.parse('${stringfiedParams}'))`
  },
  { exts: ['.ts'] },
)
