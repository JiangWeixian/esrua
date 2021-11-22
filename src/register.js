const addHook = require('pirates').addHook

const argv = require('yargs-parser')(process.argv.slice(2), { array: 'p' })

const funcName = argv._[0]
const params = argv.p

addHook(
  (code) => {
    const stringfiedParams = JSON.stringify(params)
    // return `${code} console.log(JSON.parse('${stringfiedParams}'))`
    return `${code}  ${funcName}(...JSON.parse('${stringfiedParams}'))`
  },
  { exts: ['.ts'] },
)
