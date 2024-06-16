import fs from 'node:fs'
import { pipeline } from 'node:stream/promises'
import type { fetch, request } from 'undici'

const downloadFile = async (
  body: Awaited<ReturnType<typeof request>>['body'] | NonNullable<Awaited<ReturnType<typeof fetch>>['body']>,
  outputLocationPath: string
): Promise<void> => {
  const writer = fs.createWriteStream(outputLocationPath)
  await pipeline(body, writer)
}

export default downloadFile