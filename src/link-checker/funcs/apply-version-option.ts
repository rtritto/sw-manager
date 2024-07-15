import applyRegex from './apply-regex'

/** Transform " Rev 2" -> "_Rev_2" */
const applyVersionOption = (version: string, versionOption?: ValueOf<VersionOptions>): string | Error => {
  if (versionOption !== undefined) {
    return eval(applyRegex(versionOption, { version }))
  }
  return version
}

export default applyVersionOption