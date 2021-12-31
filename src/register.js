const addHook = require('pirates').addHook
const pc = require('picocolors')
const fs = require('fs')
const { parse } = require('es-module-lexer')

const argv = require('yargs-parser')(process.argv.slice(2), { array: 'p' })

const scriptFilename = process.argv[1]
const funcName = argv._[0]
const params = argv.p

const showFunctionList = () => {
  parse(fs.readFileSync(scriptFilename).toString()).then((res) => {
    const [, exports] = res
    console.log(pc.cyan('Exported function will displayed here:'))
    console.log()
    exports.forEach((element) => {
      console.log(`- ${pc.bold(element)}`)
    })
  })
}

addHook(
  (code) => {
    if (argv.help) {
      showFunctionList()
      return code
    }
    if (!funcName) {
      console.error(`Ops, Try run ${pc.green('esrua [filepath] [function]')}`)
      return code
    }
    const stringfiedParams = JSON.stringify(params || [])
    return `${code}  ${funcName}(...JSON.parse('${stringfiedParams}'))`
  },
  { exts: ['.ts', '.tsx', '.js', '.jsx'], matcher: (filename) => filename === scriptFilename },
)
