import { openAsBlob } from 'node:fs'
import { FormData, request, type Dispatcher } from 'undici'

/**
 * HTML URL Encoding
 * %23 = #
 * %0A = \n
 */

const TELEGRAM_TOKEN_HTTP_API = '7074468759:AAGDdMC7yTFSOb5L6v4PA0o4iucICroDyyg'
const CHAT_ID = -1002227822265

const BASE_URL = 'https://api.telegram.org/bot'

type ErrorBody = {
  ok: false
  error_code: number
  description: string
}

const getJsonBody = async (response: Dispatcher.ResponseData) => {
  const body = await response.body.json()
  if (response.statusCode === 200) {
    return body
  }
  throw new Error(JSON.stringify(body as ErrorBody))
}

/**
 * https://core.telegram.org/bots/api#editmessagetext
 */
export const editMessageText = async ({ messageId, text }: {
  messageId: number
  text: string
}) => {
  return request(`${BASE_URL}${TELEGRAM_TOKEN_HTTP_API}/editMessageText`, {
    method: 'POST',
    query: {
      chat_id: CHAT_ID,
      message_id: messageId,
      text
    }
  }).then(getJsonBody)
}

/**
 * https://core.telegram.org/bots/api#sendmessage
 */
export const sendMessage = async ({ text }: {
  text: string
}) => {
  return request(`${BASE_URL}${TELEGRAM_TOKEN_HTTP_API}/sendMessage`, {
    method: 'POST',
    query: {
      chat_id: CHAT_ID,
      text
    }
  }).then(getJsonBody)
}

/**
 * https://core.telegram.org/bots/api#senddocument
 */
export const sendDocument = async ({ documentInfo: { path, name }, messageId }: {
  documentInfo: DocumentInfo
  messageId: number
}) => {
  const file = await openAsBlob(path)
  const formData = new FormData()
  formData.set('document', file, name)

  return request(`${BASE_URL}${TELEGRAM_TOKEN_HTTP_API}/sendDocument`, {
    method: 'POST',
    body: formData,
    query: {
      chat_id: CHAT_ID,
      message_id: messageId
    }
  }).then(getJsonBody)
}