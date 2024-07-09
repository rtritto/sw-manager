// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'
import { useSetAtom } from 'solid-jotai'
import { messageAtom, showNotificationAtom, showRestartButtonAtom } from './store/atoms'
import { CHANNELS } from './constants'

// Set up context bridge between the renderer process and the main process expose as window
contextBridge.exposeInMainWorld('electronApi', {
  // https://github.com/davidgs/on-air-desktop/blob/main/src/main/preload.ts
  ipcRenderer: {
    on(channel: Channels, func: (...args: any[]) => void) {
      const subscription = (_event: Electron.IpcRendererEvent, ...args: any[]) => func(...args)
      ipcRenderer.on(channel, subscription)

      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    },
    send(channel: Channels, ...args: any[]) {
      ipcRenderer.send(channel, ...args)
    }
  },
  checkForUpdate: () => ipcRenderer.invoke(CHANNELS.CHECK_FOR_UPDATE),
  singleDownload: (info: Info) => ipcRenderer.invoke(CHANNELS.SINGLE_DOWNLOAD, info)
})

const setShowNotification = useSetAtom(showNotificationAtom)
const setShowRestartButtonAtom = useSetAtom(showRestartButtonAtom)
const setMessage = useSetAtom(messageAtom)

ipcRenderer.on(CHANNELS.UPDATE_ERROR, () => {
  ipcRenderer.removeAllListeners(CHANNELS.UPDATE_ERROR)
  setMessage('Error in Update. Contact Us')
  setShowNotification(false)
})

ipcRenderer.on(CHANNELS.UPDATE_NOT_AVAILABLE, () => {
  ipcRenderer.removeAllListeners(CHANNELS.UPDATE_NOT_AVAILABLE)
  setMessage('App is up to date')
  setShowNotification(false)
})

ipcRenderer.on(CHANNELS.UPDATE_AVAILABLE, () => {
  ipcRenderer.removeAllListeners(CHANNELS.UPDATE_AVAILABLE)
  setMessage('New version available. Downloading now...')
  setShowNotification(false)
})

ipcRenderer.on(CHANNELS.UPDATE_DOWNLOADED, () => {
  ipcRenderer.removeAllListeners(CHANNELS.UPDATE_DOWNLOADED)
  setMessage('Update Downloaded. It will be installed on restart. Restart now?')
  setShowRestartButtonAtom(false)
  setShowNotification(false)
})