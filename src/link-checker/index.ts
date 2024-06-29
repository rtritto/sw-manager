import fs from 'node:fs'
import path from 'node:path'
import JSON5 from 'json5'
import { fetch, request, Agent } from 'undici'

import applyRegex from './funcs/applyRegex'
import downloadFile from './funcs/downloadFile'
import createFoder from './funcs/createFolder'
import getVersionAndFileUrl from './getVersionAndFileUrl'
import APP_MAP from '../config'

const { DOWNLOAD_ALL } = process.env

const OUTPUT_FOLDER = './output'

const MAX_CONCURRENT_REQUESTS = 5

const APP_TO_CHECK = [
  // 'Downloader',
  // 'Media',
  'SO',
  // 'Office',
  // 'Emulator',
  // 'DB'
]

const getUseRequest = ({ website }) => {
  switch (website) {
    case 'FileCatchers':
    case 'FCPortables':
      return {
        useRequest: true,
        options: {
          dispatcher: new Agent({
            connect: {
              // prevent UNABLE_TO_VERIFY_LEAF_SIGNATURE error
              // Error: unable to verify the first certificate
              rejectUnauthorized: false
            }
          })
        }
      }
    case 'GitHub': {
      return {
        useRequest: false,
        options: {
          headers: {
            Accept: 'application/octet-stream'
          }
        }
      }
    }
    default: {
      return {
        useRequest: false,
        options: {}
      }
    }
  }
}

const getLabel = (label: string, APP_MAP: Config) => {
  return APP_MAP[label]
  // TODO add generic PC support
  // return label in APP_MAP ?
  //   APP_MAP[label] :
  //   Object.keys(APP_MAP).find(k => k.includes(label))
}

const addToResult = (titleVersion: string | undefined, section: NestedConfig) => {
  const { url, download, version } = section
  return {
    version: {
      current: version,
      newest: titleVersion,
      url: download || url
    }
  }
}

export const main = async () => {
  const results: Results = {}

  for (const label of APP_TO_CHECK) {
    const SECTION = getLabel(label, APP_MAP)

    if (SECTION) {
      console.log('LABEL: ', label)
      createFoder(path.join(OUTPUT_FOLDER, label))
      results[label] = {}

      const appNames = Object.keys(SECTION)

      const promiseResult = []

      for (let i = 0, len = appNames.length; i < len; i += MAX_CONCURRENT_REQUESTS) {
        const chunk = appNames.slice(i, i + MAX_CONCURRENT_REQUESTS)
        const datas = await Promise.allSettled(
          chunk.map(async (appName) => {
            try {
              const versionAndFileUrl = await getVersionAndFileUrl(SECTION[appName])
              const { isVersionUpdated, titleVersion, fileUrl } = versionAndFileUrl
              console.debug('isVersionUpdated, titleVersion, fileUrl: ', isVersionUpdated, titleVersion, fileUrl)

              // PREVENT download FILE
              // return

              if (!titleVersion && !SECTION[appName].download) {
                results[label][appName] = addToResult(titleVersion, SECTION[appName])
                // EXIT
                return
              }

              if (isVersionUpdated === true && !(DOWNLOAD_ALL === 'true')) {
                // EXIT
                return
              }

              results[label][appName] = addToResult(titleVersion, SECTION[appName])

              // TODO remove
              return

              const appFolder = `${applyRegex(appName, { version: titleVersion! })}`

              // DELETE OLD VERSIONS
              const dirsList = fs.readdirSync(path.join(OUTPUT_FOLDER, label), { withFileTypes: true })
              const [start, end] = appName.split('<VERSION>')
              for (const dir of dirsList) {
                if (dir.isDirectory() === true) {
                  if (
                    dir.name !== appFolder
                    && dir.name.startsWith(start)
                    && dir.name.endsWith(end)
                  ) {
                    // const titleVersionOld = `${applyRegex(appName, { version: APP_MAP[label][appName].version })}`
                    const oldVersionFolder = path.join(OUTPUT_FOLDER, label, /* titleVersionOld */dir.name)
                    if (fs.existsSync(oldVersionFolder) === true) {
                      fs.rmSync(oldVersionFolder, { recursive: true })
                      // console.log(`oldVersionFolder Delete: ${oldVersionFolder}`)
                    }
                  }
                }
              }

              // if (isVersionUpdated === true && !(DOWNLOAD_ALL === 'true')) {
              //   // EXIT
              //   return
              // }

              const appFolderPath = path.join(OUTPUT_FOLDER, label, appFolder)
              /* const isFolderCreated = */ createFoder(appFolderPath)
              // if (isFolderCreated === true) {
              const filename = path.basename(fileUrl!)
              const filenamePath = path.join(OUTPUT_FOLDER, label, appFolder, filename)
              if (fs.existsSync(filenamePath) === false) {
                const { options, useRequest } = getUseRequest(SECTION[appName])
                const response = await (useRequest === true ? request : fetch)(fileUrl!, options)
                await downloadFile(response.body!, filenamePath)
              }

              // PREVENT WRITE config FILE
              return;

              // update config file
              APP_MAP[label][appName].version = titleVersion
              const updatedConfig = JSON5.stringify(APP_MAP, null, 2, { quote: '\'' })
              fs.writeFileSync('./src/config.ts', `let APP_MAP: Config = ${updatedConfig}\n\nexport default APP_MAP`)
              // }
            } catch (error) {
              error.appName = appName
              throw error
            }
          })
        )

        promiseResult.push(...datas)
      }

      const rejectedResult = promiseResult.filter((r) => r.status === 'rejected')

      if (rejectedResult.length !== 0) {
        const reasons = rejectedResult.map(r => r.reason)
        console.error(reasons)
        results.failed = reasons
      }
    } else {
      throw new Error(`Missing section: ${label}`)
    }
  }

  console.log(JSON.stringify(results, null, 2))
}

export const getDownloadLinks = async () => {

}

// main()