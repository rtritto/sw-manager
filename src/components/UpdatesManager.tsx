import { type ColumnDef, createColumnHelper } from '@tanstack/solid-table'
// import { useAtom } from 'solid-jotai'
import { createEffect, createMemo, createSignal, type Component } from 'solid-js'

// import { infosAtom } from '../store/atoms'
import { CHANNELS } from '../constants'
import Table from '../components/Table'
import selectColumn from './selectColumn'

const UpdatesManager: Component = () => {
  const [downloadProgress, setDownloadProgress] = createSignal(0)
  const [downloadFileName, setDownloadFileName] = createSignal('')
  // const [infos, setInfos] = useAtom(infosAtom)
  const [infos, setInfos] = createSignal<Info[]>([])

  const onDownload = async (info: Info) => {
    const _downloadLink = await window.electronApi.singleDownload({ ...info })
    window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_BY_URL, _downloadLink)
  }

  const checkForUpdate = async () => {
    const _infos = await window.electronApi.checkForUpdate()
    setInfos(Object.values(_infos.results))
  }

  const columnHelper = createColumnHelper<Record<string, unknown>>()
  const columns = createMemo<ColumnDef<Record<string, unknown>, any>[]>(() => [
    columnHelper.accessor('id', selectColumn), // This would be the select column
    // Other required columns
    columnHelper.accessor('imageUrl', {
      id: 'imageUrl',
      header: () => 'App',
      cell: info => <img src={info.getValue() as string} />
    }),
    columnHelper.accessor('currentVersion', {
      id: 'currentVersion',
      header: () => 'Current Version'
    }),
    columnHelper.accessor('newVersion', {
      id: 'newVersion',
      header: () => 'New Version'
    }),
    columnHelper.accessor(info => info, {
      id: 'download',
      header: () => 'Download',
      cell: info => <button class="btn" onClick={() => onDownload(info.getValue() as Info)}>Download</button>
    })
  ])

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

      <Table columnData={infos()} columns={columns()} />

      <progress class="progress progress-accent w-56" value={downloadProgress()} max="100" />

      <div>{downloadFileName()}</div>
    </div>
  )
}

export default UpdatesManager