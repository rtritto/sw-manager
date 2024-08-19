import { openAsBlob } from 'node:fs'
import { FormData, request, type Dispatcher } from 'undici'

/**
 * HTML URL Encoding
 * %23 = #
 * %0A = \n
 */

const { CHAT_ID, TELEGRAM_TOKEN_HTTP_API } = process.env

const BASE_URL = 'https://api.telegram.org/bot'

type ErrorBody = {
  ok: false
  error_code: number
  description: string
}

type RequestOptions = Parameters<typeof request>[1]

const getJsonBody = async ({ url, options, response }: { url: string, options: RequestOptions, response: Dispatcher.ResponseData }) => {
  const body = await response.body.json()
  if (response.statusCode === 200) {
    return body
  }
  throw new Error(JSON.stringify({
    url,
    statusCode: response.statusCode,
    body: body as ErrorBody,
    options
  }))
}

type SaveResponse = {
  result: {
    message_id: number
  }
}

/**
 * https://core.telegram.org/bots/api#senddocument
 */
export const sendDocument = async ({ documentInfo: { path, name }, caption }: {
  documentInfo: DocumentInfo
  caption: string
}): Promise<SaveResponse> => {
  const file = await openAsBlob(path)
  const formData = new FormData()
  const DOCUMENT_PROPERTY = 'document'
  formData.set(DOCUMENT_PROPERTY, file, name)

  const url = `${BASE_URL}${TELEGRAM_TOKEN_HTTP_API}/sendDocument`
  const options: RequestOptions = {
    method: 'POST',
    body: formData,
    query: {
      chat_id: CHAT_ID,
      media: JSON.stringify({
        type: 'document',
        media: `attach://${DOCUMENT_PROPERTY}`
      }),
      caption
    }
  }

  return request(url, options).then((response) => getJsonBody({ url, options, response }) as Promise<SaveResponse>)
}

/**
 * https://core.telegram.org/bots/api#editmessagemedia
 */
export const editMessageMedia = async ({ documentInfo: { path, name }, messageId, caption }: {
  documentInfo: DocumentInfo
  messageId: number
  caption: string
}) => {
  const file = await openAsBlob(path)
  const formData = new FormData()
  const DOCUMENT_PROPERTY = 'document'
  formData.set(DOCUMENT_PROPERTY, file, name)

  const url = `${BASE_URL}${TELEGRAM_TOKEN_HTTP_API}/editMessageMedia`
  const options: RequestOptions = {
    method: 'POST',
    body: formData,
    query: {
      chat_id: CHAT_ID,
      message_id: messageId,
      media: JSON.stringify({
        type: 'document',
        media: `attach://${DOCUMENT_PROPERTY}`,
        caption
      })
    }
  }

  return request(url, options).then((response) => getJsonBody({ url, options, response }))
}