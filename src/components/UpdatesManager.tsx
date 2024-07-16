import { type ColumnDef, createColumnHelper } from '@tanstack/solid-table'
import { IconDownload, IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerStopFilled } from '@tabler/icons-solidjs'
import bytes from 'bytes'
import type { DownloadData } from 'electron-dl-manager'
// import { useAtom } from 'solid-jotai'
import { createEffect, createMemo, createSignal, Show } from 'solid-js'

// import { infosAtom } from '../store/atoms'
import { CHANNELS } from '../constants'
import Table from '../components/Table'
import selectColumn from './selectColumn'

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

const DOWNLOAD_STATUS = {
  STARTED: CHANNELS.DOWNLOAD_STARTED,
  DOWNLOADING: CHANNELS.DOWNLOAD_PROGRESS,
  PAUSED: CHANNELS.DOWNLOAD_PAUSE,
  COMPLETED: CHANNELS.DOWNLOAD_COMPLETED,
  CANCEL: CHANNELS.DOWNLOAD_CANCEL
}

const UpdatesManager: Component = () => {
  const [downloadStatus, setDownloadStatus] = createSignal('')
  const [downloadInfoStart, setDownloadInfoStart] = createSignal<{
    fileId: string
    fileName: string
    fileSize: number
  }>({
    fileId: '',
    fileName: '',
    fileSize: 0
  })
  const [downloadInfoProgress, setDownloadInfoProgress] = createSignal<{
    downloadRateBytesPerSecond: number
    estimatedTimeRemainingSeconds: number
    percentCompleted: number
    receivedBytes: number
  }>({
    downloadRateBytesPerSecond: 0,
    estimatedTimeRemainingSeconds: 0,
    percentCompleted: 0,
    receivedBytes: 0
  })
  // const [infos, setInfos] = useAtom(infosAtom)
  const [infos, setInfos] = createSignal<Info[]>([])

  const handleCheckForUpdate = async () => {
    const _infos = await window.electronApi.checkForUpdate()
    setInfos(Object.values(_infos.results))
  }

  const handleDownload = async (info: Info) => {
    const _downloadLink = await window.electronApi.singleDownload({ ...info })
    window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_BY_URL, _downloadLink)
  }

  const handleDonwloadPause = (id: string) => {
    window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_PAUSE, id)
    setDownloadStatus(DOWNLOAD_STATUS.PAUSED)
  }

  const handleDonwloadResume = (id: string) => {
    window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_RESUME, id)
    setDownloadStatus(DOWNLOAD_STATUS.DOWNLOADING)
  }

  const handleDonwloadCancel = (id: string) => {
    window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_CANCEL, id)
  }

  const columnHelper = createColumnHelper<Record<string, unknown>>()
  const columns = createMemo<ColumnDef<Record<string, unknown>, any>[]>(() => [
    columnHelper.accessor('id', selectColumn), // This would be the select column
    // Other required columns
    columnHelper.accessor((info) => info, {
      id: 'download',
      // header: 'Download',
      header: '',
      cell: (info) => (
        <div class="btn-group btn-group-horizontal flex">
          <button class="btn" disabled={downloadInfoStart().fileName !== ''} onClick={() => handleDownload(info.getValue() as Info)}>
            <IconDownload />
          </button>

          <Show when={downloadStatus() === DOWNLOAD_STATUS.DOWNLOADING}>
            <button class="btn" disabled={downloadStatus() === DOWNLOAD_STATUS.PAUSED} onClick={() => handleDonwloadPause(downloadInfoStart().fileId)}>
              <IconPlayerPauseFilled />
            </button>
          </Show>

          <Show when={downloadStatus() === DOWNLOAD_STATUS.PAUSED}>
            <button class="btn" disabled={downloadStatus() === DOWNLOAD_STATUS.DOWNLOADING} onClick={() => handleDonwloadResume(downloadInfoStart().fileId)}>
              <IconPlayerPlayFilled />
            </button>
          </Show>

          <Show when={downloadStatus() === DOWNLOAD_STATUS.DOWNLOADING || downloadStatus() === DOWNLOAD_STATUS.PAUSED}>
            <button class="btn" onClick={() => handleDonwloadCancel(downloadInfoStart().fileId)}>
              <IconPlayerStopFilled />
            </button>
          </Show>
        </div>
      ),
      enableSorting: false
    }),
    columnHelper.accessor('imageUrl', {
      id: 'imageUrl',
      header: `App (Total: ${infos().length})`,
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
      cell: () => (
        <Show when={downloadInfoStart().fileName !== ''}>
          <div>
            {downloadInfoStart().fileName}

            <div class="my-0 h-0.5 divider divider-neutral" />

            <div class="flex items-center">
              <progress class={`progress ${downloadStatus() === DOWNLOAD_STATUS.DOWNLOADING ? 'progress-info' : (downloadStatus() === DOWNLOAD_STATUS.PAUSED ? 'progress-warning' : 'progress-accent')} w-56`} value={downloadInfoProgress().percentCompleted} max="100" />

              <span class="whitespace-nowrap px-2">{convertProgress(downloadInfoProgress().percentCompleted)}%</span>
            </div>
          </div>
        </Show>
      )
    }),
    columnHelper.accessor('', {
      id: 'size',
      header: 'Size',
      cell: () => (
        <Show when={downloadInfoStart().fileName !== ''}>
          <div>
            <Show when={downloadInfoStart().fileName && (downloadStatus() === DOWNLOAD_STATUS.DOWNLOADING || downloadStatus() === DOWNLOAD_STATUS.PAUSED)}>
              <span class="whitespace-nowrap">{convertBytes(downloadInfoProgress().receivedBytes)}</span>

              <div class="my-0 h-0.5 divider divider-neutral" />
            </Show>

            <span class="whitespace-nowrap">{convertBytes(downloadInfoStart().fileSize)}</span>
          </div>
        </Show>
      )
    }),
    columnHelper.accessor('', {
      id: 'speed',
      // header: 'Transfer Rate',
      header: 'Speed',
      cell: () => (
        <Show when={downloadInfoStart().fileName && downloadStatus() === DOWNLOAD_STATUS.DOWNLOADING}>
          <div>{convertBytes(downloadInfoProgress().downloadRateBytesPerSecond)}/s</div>
        </Show>
      )
    }),
    columnHelper.accessor('', {
      id: 'eta',
      // header: 'Time Left',
      header: 'ETA',
      cell: () => (
        <Show when={downloadInfoStart().fileName && downloadStatus() === DOWNLOAD_STATUS.DOWNLOADING}>
          <div>{convertSecondsToDHMS(downloadInfoProgress().estimatedTimeRemainingSeconds)}</div>
        </Show>
      )
    })
  ])

  createEffect(() => {
    // Listen for the event
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_STARTED, (_, {
      id,
      resolvedFilename,
      totalBytes
    }: DownloadData & { totalBytes: number }) => {
      setDownloadStatus(DOWNLOAD_STATUS.STARTED)
      setDownloadInfoStart({
        fileId: id,
        fileName: resolvedFilename,
        fileSize: totalBytes
      })
    })
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_PROGRESS, (_, {
      downloadRateBytesPerSecond,
      estimatedTimeRemainingSeconds,
      percentCompleted,
      receivedBytes
    }: DownloadData & { receivedBytes: number }) => {
      setDownloadStatus(DOWNLOAD_STATUS.DOWNLOADING)
      setDownloadInfoProgress({
        downloadRateBytesPerSecond,
        estimatedTimeRemainingSeconds,
        percentCompleted,
        receivedBytes
      })
    })
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_COMPLETED, (_, __: DownloadData & { filename: string }) => {
      setDownloadStatus(DOWNLOAD_STATUS.COMPLETED)
    })
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_CANCEL, (_, __: DownloadData & { filename: string }) => {
      setDownloadStatus(DOWNLOAD_STATUS.CANCEL)
      setDownloadInfoProgress({
        downloadRateBytesPerSecond: 0,
        estimatedTimeRemainingSeconds: 0,
        percentCompleted: 0,
        receivedBytes: 0
      })
    })
  })

  return (
    <div>
      <button class="btn" onClick={handleCheckForUpdate}>Check For Update</button>

      <Table columnData={infos()} columns={columns()} />
    </div>
  )
}

export default UpdatesManager