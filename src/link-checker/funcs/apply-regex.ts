/**
 * @param targetString
 * @param options
 */
const applyRegex = (targetString: string, { version }: { version: string }): string => {
  return targetString.replaceAll('<VERSION>', version)
}

export default applyRegex