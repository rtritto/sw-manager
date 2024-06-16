import applyRegex from './applyRegex'

/**
 * Transform " Rev 2" -> "_Rev_2"
 * @param versionOptions
 * @param version
 */
const applyVersionOptions = (version: string, versionOptions?: VersionOptions): string | Error => {
  if (versionOptions) {
    const { evaluate } = versionOptions
    if (evaluate) {
      return eval(applyRegex(evaluate, { version }))
    }
    throw Error('Missing a version option')
  }
  return version
}

export default applyVersionOptions