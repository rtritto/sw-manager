import fs from 'node:fs'

/**
 * Create directory if not exists.
 * example: dir = './tmp/but/then/nested'
 * @param dir directory path
 * @return true if folder is created
 */
const createFoder = (dir: string): boolean => {
  if (fs.existsSync(dir) === false) {
    fs.mkdirSync(dir, { recursive: true })
    return true
  }
  return false
}

export default createFoder