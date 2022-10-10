// refs: https://github.com/esbuild-kit/tsx/blob/develop/src/suppress-warnings.cts
const ignoreWarnings = new Set([
  '--experimental-loader is an experimental feature. This feature could change at any time',
  'Custom ESM Loaders is an experimental feature. This feature could change at any time',
])

const { emit } = process

// @ts-expect-error emit type mismatch
process.emit = function (event, warning) {
  if (event === 'warning' && ignoreWarnings.has(warning.message)) {
    return
  }

  // eslint-disable-next-line prefer-rest-params
  return Reflect.apply(emit, this, arguments)
}
