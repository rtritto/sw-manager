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
    const _infos = await window.electronApi.checkForUpdate()
    setInfos(Object.values(_infos.results))
  }

  createEffect(() => {
    // Listen for the event
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_PROGRESS, (percentCompleted: number) => {
      setDownloadProgress(percentCompleted)
    })
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_COMPLETED, (filename: string) => {
      setDownloadFileName(filename)
    })
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