import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { ElectronDownloadManager } from 'electron-dl-manager'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import JSON5 from 'json5'
import { applyRegex, getDownloadLink, getInfos, VERSION_SEPARATOR } from 'sw-download-checker'
import fs from 'node:fs'
import path from 'node:path'

import { CHANNELS, DOWNLOAD_FOLDER, EVENTS } from './constants'
import APP_MAP from './config'
import { createTemplate } from './telegram/utils'
import { editMessageMedia, sendDocument } from './telegram/api'

try {
  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  import.meta.resolve('electron-squirrel-startup/package.json')
  app.quit()
} catch {
  // Ignore
}

autoUpdater.logger = log
// https://github.com/megahertz/electron-log/blob/master/docs/transports/file.md
// The file transport writes log messages to a file.
// autoUpdater.logger.transports.file.level = 'info'

let mainWindow: BrowserWindow

const manager = new ElectronDownloadManager()

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    // width: 800,
    // height: 600,
    // autoHideMenuBar: true,
    // icon: 'icon.ico',
    darkTheme: true,
    webPreferences: {
      // Append DOWNLOAD_FOLDER
      additionalArguments: [`--downloads-folder=${path.join(app.getPath('downloads'), DOWNLOAD_FOLDER)}`],
      preload: path.join(import.meta.dirname, 'preload.mjs')
      // devTools: false
      // enableRemoteModule: true,  // deprecated and replaced with @electron/remote (or ipcRenderer.invoke, see README)
      //#region Fix TypeError: window.require is not a function & ReferenceError: require is not defined
      // nodeIntegration: true,
      // contextIsolation: false  // remove protection against prototype pollution
      //#endregion
    }
  })

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(import.meta.dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.maximize()

  if (process.env.NODE_ENV === 'production') {
    mainWindow.removeMenu()
  }
}

const sendStatusToWindow = (text: string) => {
  log.info(text)
  mainWindow.webContents.send(text) // send notification to UI about Update
}

autoUpdater.on(CHANNELS.ERROR, () => {
  sendStatusToWindow(CHANNELS.UPDATE_ERROR)
})
autoUpdater.on(CHANNELS.UPDATE_NOT_AVAILABLE, () => {
  sendStatusToWindow(CHANNELS.UPDATE_NOT_AVAILABLE)
})
autoUpdater.on(CHANNELS.UPDATE_AVAILABLE, () => {
  sendStatusToWindow(CHANNELS.UPDATE_AVAILABLE)
})
autoUpdater.on(CHANNELS.UPDATE_DOWNLOADED, () => {
  sendStatusToWindow(CHANNELS.UPDATE_DOWNLOADED)
})

ipcMain.on(CHANNELS.RESTART_APP, () => {
  autoUpdater.quitAndInstall()
})


ipcMain.handle(CHANNELS.SELECT_DOWNLOAD_FOLDER, async (_, defaultDownloadsFolder: string) => {
  const { filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  const selectedDownloadFolder = filePaths.at(0)
  const downloadFolder = selectedDownloadFolder === undefined ? defaultDownloadsFolder : selectedDownloadFolder
  // Append DOWNLOAD_FOLDER
  return path.join(downloadFolder, DOWNLOAD_FOLDER)
})

ipcMain.handle(CHANNELS.CHECK_FOR_UPDATE, async (_, categories: Category[]): Promise<Infos> => {
  const _infos: Infos = {}
  for (const category of categories) {
    const categoryInfos = await getInfos(APP_MAP[category], category)
    for (const appName in categoryInfos.errors) {
      const appError = categoryInfos.errors[appName] as Error
      appError.message = `${appName} - ${appError.message}`
      autoUpdater.emit(CHANNELS.ERROR, appError)
    }
    _infos[category] = categoryInfos.results
  }
  return _infos
})

ipcMain.handle(CHANNELS.SINGLE_DOWNLOAD, async (_, info: Info): Promise<string> => {
  const _downloadLink = await getDownloadLink(info)
  return _downloadLink
})

ipcMain.on(CHANNELS.DOWNLOAD_PAUSE, (_, id: string): void => {
  manager.pauseDownload(id)
})

ipcMain.on(CHANNELS.DOWNLOAD_RESUME, (_, id: string): void => {
  manager.resumeDownload(id)
})

ipcMain.on(CHANNELS.DOWNLOAD_CANCEL, (_, id: string): void => {
  manager.cancelDownload(id)
})

ipcMain.handle(CHANNELS.OPEN_FOLDER, async (_, folderPath: string | string[]) => {
  const _folderPath = folderPath.constructor.name === 'String'
    ? folderPath as string
    : path.join(...folderPath)
  // Show the folder
  // shell.showItemInFolder(_folderPath)
  // Open the folder
  await shell.openPath(_folderPath)
})

ipcMain.handle(CHANNELS.UPDATE_TELEGRAM, async (_, filteredConfig: Config, directory: string, originalConfig: Config): UpdateTelegramReturn => {
  let atLeastOneCreation = false
  for (const category in filteredConfig) {
    const appConfigs = filteredConfig[category as Category]
    for (const appName in appConfigs) {
      const appConfig = filteredConfig[category as Category][appName]

      const caption = createTemplate(appConfig, appName, category as Category)

      const documentFolder = path.join(directory, category as Category, applyRegex(appName, { version: appConfig.version }))
      // Get first occurence
      const documentName = fs.readdirSync(documentFolder).at(0)!
      const documentPath = path.join(documentFolder, documentName)
      const documentInfo: DocumentInfo = {
        path: documentPath,
        name: documentName
      }

      const { telegram = {} } = appConfig
      let { messageId } = telegram

      if (messageId === undefined) {
        ({ result: { message_id: messageId } } = await sendDocument({ documentInfo, caption }))

        if ('telegram' in appConfig) {
          originalConfig[category as Category][appName].telegram!.messageId = messageId
        } else {
          originalConfig[category as Category][appName].telegram = { messageId }
        }

        atLeastOneCreation = true
      } else {
        await editMessageMedia({ documentInfo, messageId, caption })
      }
    }
  }
  if (atLeastOneCreation === true) {
    return originalConfig
  }
  return
})

ipcMain.on(CHANNELS.UPDATE_CONFIG, (_, config: Config): void => {
  const updatedConfig = JSON5.stringify(config, null, 2, { quote: '\'' })
  fs.writeFileSync('./src/config.ts', `let APP_MAP: Config = ${updatedConfig}\n\nexport default APP_MAP`)
})

ipcMain.on(CHANNELS.DOWNLOAD_BY_URL, async (_, { appName, category, downloadLink, directory, version }: DownloadByUrlArgs): Promise<void> => {
  const categoryDirectory = path.join(directory, category)
  const firstAppName = appName.split(VERSION_SEPARATOR).at(0)!

  if (fs.existsSync(categoryDirectory) === true) {
    //#region Delete all files in directory
    const oldAppNames = fs.readdirSync(categoryDirectory).filter((_appName) => _appName.startsWith(firstAppName))

    for (const oldAppName of oldAppNames) {
      fs.rmSync(path.join(categoryDirectory, oldAppName), { recursive: true })
    }
    //#endregion
  }

  const fullDirectory = path.join(categoryDirectory, applyRegex(appName, { version }))

  // mainWindow.webContents.downloadURL(downloadUrl)

  await manager.download({
    window: mainWindow,
    url: downloadLink,
    // Change <DOWNLOAD_FOLDER> folder to <DOWNLOAD_FOLDER>/<CATERGORY>/<AppName> <NEW_VERSION>
    directory: fullDirectory,
    callbacks: {
      onDownloadStarted: ({ id, item, resolvedFilename }) => {
        mainWindow.webContents.send(CHANNELS.DOWNLOAD_STARTED, {
          appName,
          id,
          resolvedFilename,
          totalBytes: item.getTotalBytes()
        } as DownloadStartedArgs)
      },
      onDownloadProgress: ({ id, downloadRateBytesPerSecond, estimatedTimeRemainingSeconds, item, percentCompleted }) => {
        mainWindow.webContents.send(CHANNELS.DOWNLOAD_PROGRESS, {
          appName,
          id,
          downloadRateBytesPerSecond,
          estimatedTimeRemainingSeconds,
          percentCompleted,
          receivedBytes: item.getReceivedBytes()
        } as DownloadProgressArgs)
      },
      onDownloadCompleted: ({ id }) => {
        mainWindow.webContents.send(CHANNELS.DOWNLOAD_COMPLETED, { appName, id } as DownloadCompletedArgs)
      },
      onDownloadCancelled: ({ id }) => {
        mainWindow.webContents.send(CHANNELS.DOWNLOAD_CANCEL, { appName, id } as DownloadCancelArgs)
      }
    }
  })
})

// Check for Update when App launch
// app.on(EVENTS.READY, () => {
//   autoUpdater.checkForUpdates()
// })

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on(EVENTS.READY, createWindow)

app.on(EVENTS.ACTIVATE, () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// app.whenReady().then(() => {
//   // ipcMain.handle('dialog:checkForUpdate', handleCheckForUpdate)
//   ipcMain.handle(CHANNELS.CHECK_FOR_UPDATE, handleCheckForUpdate)
//   createWindow()
//   app.on(EVENTS.ACTIVATE, function () {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow()
//   })
// })

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on(EVENTS.WINDOW_ALL_CLOSED, () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})