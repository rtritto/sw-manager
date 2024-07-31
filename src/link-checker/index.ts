import fs from 'node:fs'
import path from 'node:path'
import JSON5 from 'json5'
import { fetch, request, Agent } from 'undici'

import applyRegex from './funcs/apply-regex'
import downloadFile from './funcs/download-file'
import createFoder from './funcs/create-folder'
import getVersionAndFileUrl, { getVersion } from './get-version-and-fileUrl'
import APP_MAP from '../config'

const { DOWNLOAD_ALL } = process.env

const OUTPUT_FOLDER = './output'

const MAX_CONCURRENT_REQUESTS = 5

const APP_TO_CHECK = [
  // 'Downloader',
  // 'Media',
  'SO'
  // 'Office',
  // 'Emulator',
  // 'DB'
]

const getUseRequest = ({ website }: Info) => {
  switch (website) {
    case 'FileCatchers':
    case 'FCPortables': {
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

const createResult = (newVersion: string | undefined, section: NestedConfig, imageUrl: string) => {
  const { url, download, version } = section
  return {
    version: {
      current: version,
      newest: newVersion,
      url: download || url,
      imageUrl
    }
  }
}

// const getInfo = async (obj: NestedConfig) => {
//   const info = await getVersionAndFileUrl(obj)

//   if (!info.newVersion && !obj.download) {
//     return info
//   }

//   if (info.isVersionUpdated === true && !(DOWNLOAD_ALL === 'true')) {
//     return
//   }

//   return info
// }

export const getInfos = async (appConfigs: AppConfig) => {
  const appNames = Object.keys(appConfigs)
  const results: InfoResult = {}
  const promiseErrors: { [app: string]: unknown } = {}
  for (let i = 0, len = appNames.length; i < len; i += MAX_CONCURRENT_REQUESTS) {
    const chunk = appNames.slice(i, i + MAX_CONCURRENT_REQUESTS)
    await Promise.allSettled(
      chunk.map(async (appName: string) => {
        try {
          const info = await getVersion(appConfigs[appName])
          const { isVersionUpdated } = info
          if (isVersionUpdated === false) {
            results[appName] = info
          }
        } catch (error) {
          promiseErrors[appName] = error
        }
      })
    )
  }
  return {
    results,
    errors: promiseErrors
  }
}

export const main = async () => {
  const results: Results = {}

  for (const label of APP_TO_CHECK) {
    const SECTION = getLabel(label, APP_MAP)

    if (SECTION) {
      // console.log('LABEL:', label)
      createFoder(path.join(OUTPUT_FOLDER, label))
      results[label] = {}

      const appNames = Object.keys(SECTION)

      const promiseResult = []

      for (let i = 0, len = appNames.length; i < len; i += MAX_CONCURRENT_REQUESTS) {
        const chunk = appNames.slice(i, i + MAX_CONCURRENT_REQUESTS)
        const datas = await Promise.allSettled(
          chunk.map(async (appName) => {
            try {
              // TODO remove
              // const info = await getInfo(SECTION[appName])
              // if (info) {
              //   results[label][appName] = createResult(info.newVersion, SECTION[appName], info.imageUrl!)
              // }

              const info = await getVersionAndFileUrl(SECTION[appName])
              results[label][appName] = createResult(info.newVersion, SECTION[appName], info.imageUrl!)

              // PREVENT download FILE
              return

              const appFolder = `${applyRegex(appName, { version: info.newVersion! })}`

              // DELETE OLD VERSIONS
              const dirsList = fs.readdirSync(path.join(OUTPUT_FOLDER, label), { withFileTypes: true })
              const [start, end] = appName.split('<VERSION>')
              for (const dir of dirsList) {
                if (
                  dir.isDirectory() === true
                  && dir.name !== appFolder
                  && dir.name.startsWith(start)
                  && dir.name.endsWith(end)
                ) {
                  // const newVersionOld = `${applyRegex(appName, { version: APP_MAP[label][appName].version })}`
                  const oldVersionFolder = path.join(OUTPUT_FOLDER, label, /* newVersionOld */dir.name)
                  if (fs.existsSync(oldVersionFolder) === true) {
                    fs.rmSync(oldVersionFolder, { recursive: true })
                    // console.log(`oldVersionFolder Delete: ${oldVersionFolder}`)
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
              const filename = path.basename(info.fileUrl!)
              const filenamePath = path.join(OUTPUT_FOLDER, label, appFolder, filename)
              if (fs.existsSync(filenamePath) === false) {
                const { options, useRequest } = getUseRequest(SECTION[appName])
                const response = await (useRequest === true ? request : fetch)(info.fileUrl!, options)
                await downloadFile(response.body!, filenamePath)
              }

              // PREVENT WRITE config FILE
              // eslint-disable-next-line semi
              return;

              // update config file
              APP_MAP[label][appName].version = info.newVersion
              const updatedConfig = JSON5.stringify(APP_MAP, null, 2, { quote: '\'' })
              fs.writeFileSync('./src/config.ts', `let APP_MAP = ${updatedConfig}\n\nexport default APP_MAP`)
              // }
            } catch (error) {
              error.appName = appName
              throw error
            }
          })
        )

        promiseResult.push(...datas)
      }

      return results[label]

      const rejectedResult = promiseResult.filter((r) => r.status === 'rejected')

      if (rejectedResult.length > 0) {
        const reasons = rejectedResult.map(r => r.reason)
        console.error(reasons)
        results.failed = reasons
      }
    } else {
      throw new Error(`Missing section: ${label}`)
    }
  }

  // console.log(JSON.stringify(results, null, 2))
}

// main()