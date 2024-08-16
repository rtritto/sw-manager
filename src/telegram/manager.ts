import { applyRegex } from 'sw-download-checker'

import { editMessageText, sendDocument, sendMessage } from './api'

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

export const updateTextMessage = async (nestedConfig: NestedConfig, text: string) => {
  const { telegram = {} } = nestedConfig
  let { messageId } = telegram

  if (messageId === undefined) {
    const resp = await sendMessage({ text }) as { result: { message_id: number } }
    if ('telegram' in nestedConfig) {
      messageId = resp.result.message_id
      nestedConfig.telegram!.messageId = messageId
    } else {
      nestedConfig.telegram = { messageId }
    }
  } else {
    await editMessageText({ messageId, text })
  }

  return messageId
}

export const uploadDocument = async (nestedConfig: NestedConfig, documentInfo: DocumentInfo) => {
  const { telegram = {} } = nestedConfig
  const { messageId } = telegram

  await sendDocument({ documentInfo, messageId: messageId! })
}