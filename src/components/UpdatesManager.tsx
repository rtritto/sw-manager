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

  const eta = []
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
  const [downloadId, setDownloadId] = createSignal('')
  const [downloadStatus, setDownloadStatus] = createSignal('')
  const [downloadFilename, setDownloadFilename] = createSignal('')
  const [downloadFilesize, setDownloadFilesize] = createSignal(0)
  const [downloadReceivedBytes, setDownloadReceivedBytes] = createSignal(0)
  const [downloadProgress, setDownloadProgress] = createSignal(0)
  const [downloadRateBPS, setDownloadRateBPS] = createSignal(0)
  const [timeRemainingSeconds, setTimeRemainingSeconds] = createSignal(0)
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
          <button class="btn" disabled={downloadFilename() !== ''} onClick={() => handleDownload(info.getValue() as Info)}>
            <IconDownload />
          </button>

          <Show when={downloadStatus() === DOWNLOAD_STATUS.DOWNLOADING}>
            <button class="btn" disabled={downloadStatus() === DOWNLOAD_STATUS.PAUSED} onClick={() => handleDonwloadPause(downloadId() as string)}>
              <IconPlayerPauseFilled />
            </button>
          </Show>

          <Show when={downloadStatus() === DOWNLOAD_STATUS.PAUSED}>
            <button class="btn" disabled={downloadStatus() === DOWNLOAD_STATUS.DOWNLOADING} onClick={() => handleDonwloadResume(downloadId() as string)}>
              <IconPlayerPlayFilled />
            </button>
          </Show>

          <Show when={downloadStatus() === DOWNLOAD_STATUS.DOWNLOADING || downloadStatus() === DOWNLOAD_STATUS.PAUSED}>
            <button class="btn" onClick={() => handleDonwloadCancel(downloadId() as string)}>
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
        <Show when={downloadFilename() !== ''}>
          <div>
            {downloadFilename()}

            <div class="my-0 h-0.5 divider divider-neutral" />

            <div class="flex items-center">
              <progress class={`progress ${downloadStatus() === DOWNLOAD_STATUS.DOWNLOADING ? 'progress-info' : (downloadStatus() === DOWNLOAD_STATUS.PAUSED ? 'progress-warning' : 'progress-accent')} w-56`} value={downloadProgress()} max="100" />

              <span class="whitespace-nowrap px-2">{convertProgress(downloadProgress())}%</span>
            </div>
          </div>
        </Show>
      )
    }),
    columnHelper.accessor('', {
      id: 'size',
      header: 'Size',
      cell: () => (
        <Show when={downloadFilename() !== ''}>
          <div>
            <Show when={downloadFilename() && (downloadStatus() === DOWNLOAD_STATUS.DOWNLOADING || downloadStatus() === DOWNLOAD_STATUS.PAUSED)}>
              <span class="whitespace-nowrap">{convertBytes(downloadReceivedBytes())}</span>

              <div class="my-0 h-0.5 divider divider-neutral" />
            </Show>

            <span class="whitespace-nowrap">{convertBytes(downloadFilesize())}</span>
          </div>
        </Show>
      )
    }),
    columnHelper.accessor('', {
      id: 'speed',
      // header: 'Transfer Rate',
      header: 'Speed',
      cell: () => (
        <Show when={downloadFilename() && downloadStatus() === DOWNLOAD_STATUS.DOWNLOADING}>
          <div>{convertBytes(downloadRateBPS())}/s</div>
        </Show>
      )
    }),
    columnHelper.accessor('', {
      id: 'eta',
      // header: 'Time Left',
      header: 'ETA',
      cell: () => (
        <Show when={downloadFilename() && downloadStatus() === DOWNLOAD_STATUS.DOWNLOADING}>
          <div>{convertSecondsToDHMS(timeRemainingSeconds())}</div>
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
      setDownloadId(id)
      setDownloadFilename(resolvedFilename)
      setDownloadFilesize(totalBytes)
    })
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_PROGRESS, (_, {
      id,
      downloadRateBytesPerSecond,
      estimatedTimeRemainingSeconds,
      percentCompleted,
      receivedBytes
    }: DownloadData & { receivedBytes: number }) => {
      if (downloadStatus() !== DOWNLOAD_STATUS.PAUSED) {
        setDownloadStatus(DOWNLOAD_STATUS.DOWNLOADING)
      }
      // setDownloadId(id)
      setDownloadProgress(percentCompleted)
      setDownloadReceivedBytes(receivedBytes)
      setDownloadRateBPS(downloadRateBytesPerSecond)
      setTimeRemainingSeconds(estimatedTimeRemainingSeconds)
    })
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_COMPLETED, (_, {
      id,
      filename
    }: DownloadData & { filename: string }) => {
      setDownloadStatus(DOWNLOAD_STATUS.COMPLETED)
      // setDownloadId(id)
    })
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_CANCEL, (_, {
      id,
      filename
    }: DownloadData & { filename: string }) => {
      setDownloadStatus(DOWNLOAD_STATUS.CANCEL)
      // setDownloadId(id)
      setDownloadProgress(0)
      setDownloadReceivedBytes(0)
      setDownloadRateBPS(0)
      setTimeRemainingSeconds(0)
    })
  }, [])

  return (
    <div>
      <button class="btn" onClick={handleCheckForUpdate}>Check For Update</button>

      <Table columnData={infos()} columns={columns()} />
    </div>
  )
}

export default UpdatesManager