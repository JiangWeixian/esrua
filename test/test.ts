import { imported } from './imported'

/**
 * @fileoverview for test
 */

export const welcome = (msg: string) => {
  imported()
  console.log(`hello ${msg}`)
}
