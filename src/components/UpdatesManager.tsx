import type { File, Progress } from 'electron-dl'
import { useAtom } from 'solid-jotai'
import { createEffect, createSignal, type Component } from 'solid-js'
import { infosAtom } from '../store/atoms'
import { CHANNELS } from '../constants'
import TableSelectionRows from '../components/TableSelectionRows'

const UpdatesManager: Component = () => {
  const [downloadProgress, setDownloadProgress] = createSignal(0)
  const [downloadFileName, setDownloadFileName] = createSignal('')
  const [infos, setInfos] = useAtom(infosAtom)

  const checkForUpdate = async () => {
    // window.electronApi.ipcRenderer.send(CHANNELS.CHECK_FOR_UPDATE)
    const _infos = await window.electronApi.checkForUpdate()
    setInfos(Object.values(_infos.results))
  }

  createEffect(() => {
    // Listen for the event
    console.log('createEffect');
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_PROGRESS, (event: Electron.IpcRendererEvent, args: Progress[]) => {
      const [progress] = args
      console.log('window.electronApi.ipcRenderer progress.percent: ', progress.percent);
      setDownloadProgress(progress.percent * 100)
    })
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_COMPLETED, (event: Electron.IpcRendererEvent, args: File[]) => {
      const [downloadedItem] = args
      console.log('window.electronApi.ipcRenderer downloadedItem: ', downloadedItem);
      setDownloadFileName(downloadedItem.path.split('/').pop())
    })

    // Clean the listener after the component is dismounted
    return () => {
      window.electronApi.ipcRenderer.removeAllListeners(CHANNELS.CHECK_FOR_UPDATE)
    }
  }, [])

  return (
    <div>
      <button class="btn" onClick={checkForUpdate}>Check For Update</button>

      <TableSelectionRows infos={infos()} />

      <progress class="progress progress-accent w-56" value={downloadProgress()} max="100" />

      <div>{downloadFileName()}</div>
    </div>
  )
}

export default UpdatesManager