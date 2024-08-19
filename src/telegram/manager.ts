import { applyRegex } from 'sw-download-checker'

const HASH_TAG = '#'
const EOL = '\n'

/**
 *  https://core.telegram.org/bots/faq#my-bot-is-hitting-limits-how-do-i-avoid-this
 *  Limits:
 *  - 30 message per seconds
 *  - 20 message per minutes
 */

export const createTemplate = ({ url, version, telegram = {} }: NestedConfig, appName: string, category: Category) => {
  const { tags = [] } = telegram

  const mappedTags: string[] = [`${HASH_TAG}${category}`]
  for (const tag of tags) {
    mappedTags.push(`${HASH_TAG}${tag}`)
  }

  const templateTags = mappedTags.join(' ')
  const templateAppName = applyRegex(appName, { version })
  const templateUrl = url === undefined ? '' : `${EOL}${url}`
  return `${templateTags}${EOL}${templateAppName}${templateUrl}`
}