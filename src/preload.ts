// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'
import { useSetAtom } from 'solid-jotai'
import { messageAtom, showNotificationAtom, showRestartButtonAtom } from './store/atoms'
import { CHANNELS } from './constants'

// Set up context bridge between the renderer process and the main process
// expose as window
contextBridge.exposeInMainWorld('electronApi', {
  ipcRenderer: {
    send: ipcRenderer.send
  },
  checkForUpdate: () => ipcRenderer.invoke(CHANNELS.CHECK_FOR_UPDATE),
  singleDownload: (info: Info) => ipcRenderer.invoke(CHANNELS.SINGLE_DOWNLOAD, info)
})
// contextBridge.exposeInMainWorld('api', {
// send: (channel, data) => {
//   // whitelist channels
//   let validChannels = ["toMain"]
//   if (validChannels.includes(channel)) {
//     ipcRenderer.send(channel, data)
//   }
// },
// receive: (channel, func) => {
//   let validChannels = ["fromMain"]
//   if (validChannels.includes(channel)) {
//     // Deliberately strip event as it includes `sender`
//     ipcRenderer.on(channel, (event, ...args) => fn(...args))
//   }
// }
// })

// contextBridge.exposeInMainWorld('windowControls', {
//   // close: () => ipcRenderer.send('windowControls:close'),
//   // maximize: () => ipcRenderer.send('windowControls:maximize'),
//   // minimize: () => ipcRenderer.send('windowControls:minimize'),
//   // add: (data) => ipcRenderer.send('item:add', data),
// })

// ipcRenderer.on('itemreceived',(event,message)=>{
//   console.log('item received message',message)
// }

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