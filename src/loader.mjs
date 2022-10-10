// refs: https://github.com/antfu/esbuild-node-loader/blob/main/loader.mjs
import { URL, pathToFileURL, fileURLToPath } from 'url'
import fs from 'fs'
import { dirname } from 'path'
import { build } from 'esbuild'

import pc from 'picocolors'
import { parse } from 'es-module-lexer'
import yargsParser from 'yargs-parser'

const argv = yargsParser(process.argv.slice(2), { array: 'p' })

const scriptFilename = process.argv[1]
const funcName = argv._[0]
const params = argv.p

const showFunctionList = () => {
  parse(fs.readFileSync(scriptFilename).toString()).then((res) => {
    const [, exports] = res
    console.log(`Usage: ${pc.green('esrua [filepath] [function-name]')}`)
    console.log()
    console.log(pc.cyan('Exported function will displayed here:'))
    console.log()
    exports.forEach((element) => {
      console.log(`- ${pc.bold(element)}`)
    })
  })
}

const patch = (code) => {
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
}

const extensionsRegex = /\.m?(tsx?|json)$/

async function esbuildResolve(id, dir) {
  let result

  await build({
    stdin: {
      contents: `import ${JSON.stringify(id)}`,
      resolveDir: dir,
    },
    write: false,
    bundle: true,
    treeShaking: false,
    ignoreAnnotations: true,
    platform: 'node',
    plugins: [
      {
        name: 'resolve',
        setup({ onLoad }) {
          onLoad({ filter: /.*/ }, (args) => {
            result = args.path
            return { contents: '' }
          })
        },
      },
    ],
  })
  return result
}

function getTsCompatSpecifier(parentURL, specifier) {
  let tsSpecifier
  let search

  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    // Relative import
    const url = new URL(specifier, parentURL)
    tsSpecifier = fileURLToPath(url).replace(/\.tsx?$/, '')
    search = url.search
  } else {
    // Bare import
    tsSpecifier = specifier
    search = ''
  }

  return {
    tsSpecifier,
    search,
  }
}

function isValidURL(s) {
  try {
    return !!new URL(s)
  } catch (e) {
    if (e instanceof TypeError) return false

    throw e
  }
}

export async function resolve(specifier, context, defaultResolve) {
  const { parentURL } = context

  let url

  // According to Node's algorithm, we first check if it is a valid URL.
  // When the module is the entry point, node will provides a file URL to it.
  if (isValidURL(specifier)) {
    url = new URL(specifier)
  } else {
    // Try to resolve the module according to typescript's algorithm,
    // and construct a valid url.

    const parsed = getTsCompatSpecifier(parentURL, specifier)
    const path = await esbuildResolve(parsed.tsSpecifier, dirname(fileURLToPath(parentURL)))
    if (path) {
      url = pathToFileURL(path)
      url.search = parsed.search
    }
  }

  if (url) {
    // If the resolved file is typescript
    if (extensionsRegex.test(url.pathname)) {
      return {
        url: url.href,
        format: 'module',
        shortCircuit: true,
      }
    }
    // Else, for other types, use default resolve with the valid path
    return defaultResolve(url.href, context, defaultResolve)
  }

  return defaultResolve(specifier, context, defaultResolve)
}

export async function load(url, context, defaultLoad) {
  if (extensionsRegex.test(new URL(url).pathname)) {
    const result = await defaultLoad(url, context, defaultLoad)
    result.shortCircuit = true
    if (url.includes(scriptFilename)) {
      result.source = patch(result.source)
    }

    return result
  }

  // Let Node.js handle all other sources.
  return defaultLoad(url, context, defaultLoad)
}
