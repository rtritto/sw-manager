import { createColumnHelper } from '@tanstack/solid-table'
import type { ColumnDef } from '@tanstack/solid-table'
import { IconDownload, IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerStopFilled, IconSearch } from '@tabler/icons-solidjs'
import bytes from 'bytes'
import type { DownloadData } from 'electron-dl-manager'
import { useAtom } from 'solid-jotai'
import { createEffect, createMemo, createSignal, Show } from 'solid-js'
import { createStore } from 'solid-js/store'

// import { infosAtom } from '../store/atoms'
import { CHANNELS, DOWNLOAD_STATUS } from '../constants'
import Table from '../components/Table'
import selectColumn from './selectColumn'
import { directoryAtom, rowSelectionAtom } from '../store/atoms'

const convertProgress = (progress: number): string => {
  if (progress === 100) {
    return progress.toString()
  }
  return progress.toFixed(2)
}

const SECOND = 60
const MINUTE = 3600
const HOUR = 24
const M_X_H = MINUTE * HOUR

const convertSecondsToDHMS = (seconds: number): string => {
  const d = Math.floor(seconds / M_X_H)
  const h = Math.floor(seconds % M_X_H / SECOND)
  const m = Math.floor(seconds % MINUTE / SECOND)
  const s = Math.floor(seconds % SECOND)

  const eta: string[] = []
  if (d > 0) eta.push(`${d}d`)
  if (h > 0) eta.push(`${h}h`)
  if (m > 0) eta.push(`${m}m`)
  if (s > 0) eta.push(`${s}s`)

  return eta.join(':')
}

const convertBytes = (bytesToConvert: number): string => bytes(bytesToConvert, { fixedDecimals: true, unitSeparator: ' ' })

const UpdatesManager: Component = () => {
  const [downloadStatus, setDownloadStatus] = createStore<{ [rowId: string]: ValueOf<typeof DOWNLOAD_STATUS> }>({})
  const [downloadInfoStart, setDownloadInfoStart] = createStore<{
    [rowId: string]: {
      fileId: string
      fileName: string
      fileSize: number
    }
  }>({})
  const [downloadInfoProgress, setDownloadInfoProgress] = createStore<{
    [rowId: string]: {
      downloadRateBytesPerSecond: number
      estimatedTimeRemainingSeconds: number
      percentCompleted: number
      receivedBytes: number
    }
  }>({})
  const [infos, setInfos] = createSignal<Info[]>([])
  const [rowSelection, setRowSelection] = useAtom(rowSelectionAtom)
  const [directory, setDirectory] = useAtom(directoryAtom)

  const handleSelectDownlaod = async () => {
    const selectedDownloadFolder = await window.electronApi.selectDownloadFolder()
    setDirectory(selectedDownloadFolder)
  }

  const handleCheckForUpdate = async () => {
    const _infos = await window.electronApi.checkForUpdate()
    setRowSelection({})
    setInfos(Object.values(_infos.results))
  }

  const handleDownloadSelected = async (rowIds: string[], directory?: string) => {
    await Promise.all(
      rowIds.map(async (rowId: string) => handleDownload(infos()[parseInt(rowId, 10)], rowId, directory))
    )
  }

  const handlePauseSelected = async (rowIds: string[]) => {
    await Promise.all(
      rowIds.map(async (rowId: string) => handleDonwloadPause(downloadInfoStart[rowId].fileId, rowId))
    )
  }

  const handleResumeSelected = async (rowIds: string[]) => {
    await Promise.all(
      rowIds.map(async (rowId: string) => handleDonwloadResume(downloadInfoStart[rowId].fileId, rowId))
    )
  }

  const handleCancelSelected = async (rowIds: string[]) => {
    await Promise.all(
      rowIds.map(async (rowId: string) => handleDonwloadCancel(downloadInfoStart[rowId].fileId))
    )
  }

  const handleDownload = async (info: Info, rowId: string, directory?: string) => {
    const downloadLink = await window.electronApi.singleDownload({ ...info })
    window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_BY_URL, {
      downloadLink,
      rowId,
      directory
    })
  }

  const handleDonwloadPause = (id: string, rowId: string) => {
    window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_PAUSE, id)
    setDownloadStatus(rowId, DOWNLOAD_STATUS.PAUSED)
  }

  const handleDonwloadResume = (id: string, rowId: string) => {
    window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_RESUME, id)
    setDownloadStatus(rowId, DOWNLOAD_STATUS.DOWNLOADING)
  }

  const handleDonwloadCancel = (id: string) => {
    window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_CANCEL, id)
  }

  const columnHelper = createColumnHelper<Record<string, unknown>>()
  const columns = createMemo<ColumnDef<Record<string, unknown>, any>[]>(() => [
    columnHelper.accessor('id', selectColumn), // This would be the select column
    // Other required columns
    // columnHelper.accessor((info) => info, {
    //   id: 'download',
    //   // header: 'Download',
    //   header: '',
    //   cell: (info) => (
    //     <div class="btn-group btn-group-horizontal items-center flex">
    //       <button
    //         class="btn" disabled={info.row.id in downloadInfoStart ? downloadInfoStart[info.row.id].fileName !== '' : false}
    //         onClick={() => handleDownload(info.getValue() as Info, info.row.id, directory())}
    //       >
    //         <IconDownload />
    //       </button>

    //       <Show when={info.row.id in downloadInfoStart ? downloadStatus[info.row.id] === DOWNLOAD_STATUS.DOWNLOADING : false}>
    //         <button
    //           class="btn"
    //           disabled={downloadStatus[info.row.id] === DOWNLOAD_STATUS.PAUSED}
    //           onClick={() => handleDonwloadPause(downloadInfoStart[info.row.id].fileId, info.row.id)}
    //         >
    //           <IconPlayerPauseFilled />
    //         </button>
    //       </Show>

    //       <Show when={info.row.id in downloadInfoStart ? downloadStatus[info.row.id] === DOWNLOAD_STATUS.PAUSED : false}>
    //         <button
    //           class="btn"
    //           disabled={downloadStatus[info.row.id] === DOWNLOAD_STATUS.DOWNLOADING}
    //           onClick={() => handleDonwloadResume(downloadInfoStart[info.row.id].fileId, info.row.id)}
    //         >
    //           <IconPlayerPlayFilled />
    //         </button>
    //       </Show>

    //       <Show
    //         when={info.row.id in downloadInfoStart
    //           ? (downloadStatus[info.row.id] === DOWNLOAD_STATUS.DOWNLOADING || downloadStatus[info.row.id] === DOWNLOAD_STATUS.PAUSED)
    //           : false}
    //       >
    //         <button class="btn" onClick={() => handleDonwloadCancel(downloadInfoStart[info.row.id].fileId)}>
    //           <IconPlayerStopFilled />
    //         </button>
    //       </Show>
    //     </div>
    //   ),
    //   enableSorting: false
    // }),
    columnHelper.accessor('imageUrl', {
      id: 'imageUrl',
      // TODO fix length always 0
      // header: `App (Total: ${infos().length})`,
      header: 'App',
      cell: info => <img src={info.getValue() as string} />
    }),
    columnHelper.accessor('currentVersion', {
      id: 'currentVersion',
      header: 'Current Version'
    }),
    columnHelper.accessor('newVersion', {
      id: 'newVersion',
      header: 'New Version'
    }),
    columnHelper.accessor('', {
      id: 'progress',
      // header: 'Download Status',
      header: 'Progress',
      cell: (info) => (
        <Show when={info.row.id in downloadInfoStart ? downloadInfoStart[info.row.id].fileName !== '' : false}>
          <div>
            {downloadInfoStart[info.row.id].fileName}

            <Show
              when={downloadStatus[info.row.id] === DOWNLOAD_STATUS.DOWNLOADING
                || downloadStatus[info.row.id] === DOWNLOAD_STATUS.PAUSED
                || downloadStatus[info.row.id] === DOWNLOAD_STATUS.COMPLETED}
            >
              <div class="my-0 h-0.5 divider divider-neutral" />

              <div class="flex items-center">
                <progress
                  class={`progress ${downloadStatus[info.row.id] === DOWNLOAD_STATUS.DOWNLOADING
                    ? 'progress-info'
                    : (downloadStatus[info.row.id] === DOWNLOAD_STATUS.PAUSED ? 'progress-warning' : 'progress-accent')} w-56`}
                  value={downloadInfoProgress[info.row.id].percentCompleted} max="100"
                />

                <span class="whitespace-nowrap px-2">{convertProgress(downloadInfoProgress[info.row.id].percentCompleted)}%</span>
              </div>
            </Show>
          </div>
        </Show>
      )
    }),
    columnHelper.accessor('', {
      id: 'size',
      header: 'Size',
      cell: (info) => (
        <Show when={info.row.id in downloadInfoStart ? downloadInfoStart[info.row.id].fileName !== '' : false}>
          <div>
            <Show
              when={downloadInfoStart[info.row.id].fileName
                && (downloadStatus[info.row.id] === DOWNLOAD_STATUS.DOWNLOADING || downloadStatus[info.row.id] === DOWNLOAD_STATUS.PAUSED)}
            >
              <span class="whitespace-nowrap">{convertBytes(downloadInfoProgress[info.row.id].receivedBytes)}</span>

              <div class="my-0 h-0.5 divider divider-neutral" />
            </Show>

            <span class="whitespace-nowrap">{convertBytes(downloadInfoStart[info.row.id].fileSize)}</span>
          </div>
        </Show>
      )
    }),
    columnHelper.accessor('', {
      id: 'speed',
      // header: 'Transfer Rate',
      header: 'Speed',
      cell: (info) => (
        <Show
          when={info.row.id in downloadInfoStart
            ? (downloadInfoStart[info.row.id].fileName && downloadStatus[info.row.id] === DOWNLOAD_STATUS.DOWNLOADING)
            : false}
        >
          <div>{convertBytes(downloadInfoProgress[info.row.id].downloadRateBytesPerSecond)}/s</div>
        </Show>
      )
    }),
    columnHelper.accessor('', {
      id: 'eta',
      // header: 'Time Left',
      header: 'ETA',
      cell: (info) => (
        <Show when={info.row.id in downloadInfoStart ? (downloadInfoStart[info.row.id].fileName && downloadStatus[info.row.id] === DOWNLOAD_STATUS.DOWNLOADING) : false}>
          <div>{convertSecondsToDHMS(downloadInfoProgress[info.row.id].estimatedTimeRemainingSeconds)}</div>
        </Show>
      )
    })
  ])

  createEffect(() => {
    // Listen for the event
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_STARTED, (_, {
      rowId,
      id,
      resolvedFilename,
      totalBytes
    }: DownloadData & { rowId: string, totalBytes: number }) => {
      setDownloadInfoStart(rowId, {
        fileId: id,
        fileName: resolvedFilename,
        fileSize: totalBytes
      })
      setDownloadStatus(rowId, DOWNLOAD_STATUS.STARTED)
    })
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_PROGRESS, (_, {
      rowId,
      downloadRateBytesPerSecond,
      estimatedTimeRemainingSeconds,
      percentCompleted,
      receivedBytes
    }: DownloadData & { rowId: string, receivedBytes: number }) => {
      setDownloadInfoProgress(rowId, {
        downloadRateBytesPerSecond,
        estimatedTimeRemainingSeconds,
        percentCompleted,
        receivedBytes
      })
      setDownloadStatus(rowId, DOWNLOAD_STATUS.DOWNLOADING)
    })
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_COMPLETED, (_, { rowId }: DownloadData & { rowId: string }) => {
      setDownloadStatus(rowId, DOWNLOAD_STATUS.COMPLETED)
    })
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_CANCEL, (_, { rowId }: DownloadData & { rowId: string }) => {
      setDownloadInfoProgress(rowId, {
        downloadRateBytesPerSecond: 0,
        estimatedTimeRemainingSeconds: 0,
        percentCompleted: 0,
        receivedBytes: 0
      })
      setDownloadStatus(rowId, DOWNLOAD_STATUS.CANCEL)
    })
  })

  return (
    <div>
      <div class="btn-group btn-group-horizontal items-center flex">
        <button class="btn" onClick={handleSelectDownlaod}>Select Download Folder</button>

        <button class="btn" disabled={directory() === undefined} onClick={() => setDirectory(undefined)}>Reset Download folder</button>

        <div>Download Folder: {directory()}</div>
      </div>

      <div class="btn-group btn-group-horizontal items-center flex">
        <button class="btn" onClick={handleCheckForUpdate}>
          <IconSearch />
        </button>

        <div class="tooltip" data-tip="Download Selected">
          <button
            class="btn"
            disabled={(Object.keys(rowSelection()).length === 0) || (Object.keys(rowSelection()).some((rowId) =>
              (rowId in downloadStatus) === false || downloadStatus[rowId] === DOWNLOAD_STATUS.COMPLETED
            ) === false)}
            onClick={() => handleDownloadSelected(Object.keys(rowSelection()), directory())}
          >
            <IconDownload />
          </button>

          <button
            class="btn"
            disabled={Object.values(downloadStatus).includes(DOWNLOAD_STATUS.DOWNLOADING) === false}
            onClick={() => handlePauseSelected(Object.keys(rowSelection()))}
          >
            <IconPlayerPauseFilled />
          </button>

          <button
            class="btn"
            disabled={Object.values(downloadStatus).includes(DOWNLOAD_STATUS.PAUSED) === false}
            onClick={() => handleResumeSelected(Object.keys(rowSelection()))}
          >
            <IconPlayerPlayFilled />
          </button>

          <button
            class="btn"
            disabled={Object.values(downloadStatus).some((status) =>
              status === DOWNLOAD_STATUS.DOWNLOADING || status === DOWNLOAD_STATUS.PAUSED
            ) === false}
            onClick={() => handleCancelSelected(Object.keys(rowSelection()))}
          >
            <IconPlayerStopFilled />
          </button>
        </div>
      </div>

      <Table columnData={infos()} columns={columns()} />
    </div>
  )
}

export default UpdatesManager