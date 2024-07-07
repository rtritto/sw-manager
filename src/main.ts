import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import path from 'node:path'
import { CHANNELS, EVENTS } from './constants'
import { getInfos } from './link-checker'
import { getDownloadLink } from './link-checker/getVersionAndFileUrl'
import APP_MAP from './config'
import { download, CancelError } from 'electron-dl'

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

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // autoHideMenuBar: true,
    // icon: 'icon.ico',
    webPreferences: {
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

  // mainWindow.maximize();
}

function sendStatusToWindow(text: string) {
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

const handleCheckForUpdate = async () => {
  const infos = await getInfos(APP_MAP.SO)
  return infos
}

ipcMain.handle(CHANNELS.CHECK_FOR_UPDATE, handleCheckForUpdate)

const handleSingleDownload = async (event: Electron.IpcMainInvokeEvent, info: Info): Promise<string> => {
  const downloadLink = await getDownloadLink(info)
  return downloadLink
}

ipcMain.handle(CHANNELS.SINGLE_DOWNLOAD, handleSingleDownload)

ipcMain.on(CHANNELS.DOWNLOAD_BY_URL, async (event: Electron.IpcMainInvokeEvent, downloadUrl: string) => {
  // mainWindow.webContents.downloadURL(downloadUrl)

  const win = BrowserWindow.getFocusedWindow()!
  try {
    await download(win, downloadUrl, { saveAs: true })
  } catch (error) {
    if (error instanceof CancelError) {
      console.info('item.cancel() was called')
    } else {
      console.error(error)
    }
  }
})

// ipcMain.on(CHANNELS.CHECK_FOR_UPDATE, async () => {
//   // autoUpdater.checkForUpdates()
//   const infos = await getInfos(APP_MAP.SO)
//   console.log('a: ', infos);
// })

// Check for Update when App launch
// app.on(EVENTS.READY, () => {
//   autoUpdater.checkForUpdates()
// })

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on(EVENTS.READY, createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on(EVENTS.WINDOW_ALL_CLOSED, () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

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