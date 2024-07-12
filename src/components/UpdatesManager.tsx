import { type ColumnDef, createColumnHelper } from '@tanstack/solid-table'
import { IconDownload } from '@tabler/icons-solidjs'
import bytes from 'bytes'
import type { DownloadData } from 'electron-dl-manager'
// import { useAtom } from 'solid-jotai'
import { createEffect, createMemo, createSignal, Show, type Component } from 'solid-js'

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

const convertBytes = (bytesToConvert: number): string => bytes(bytesToConvert, { unitSeparator: ' ' })

const UpdatesManager: Component = () => {
  const [downloadFilename, setDownloadFilename] = createSignal('')
  const [downloadFilesize, setDownloadFilesize] = createSignal(0)
  const [downloadReceivedBytes, setDownloadReceivedBytes] = createSignal(0)
  const [downloadProgress, setDownloadProgress] = createSignal(0)
  const [downloadRateBPS, setDownloadRateBPS] = createSignal(0)
  const [timeRemainingSeconds, setTimeRemainingSeconds] = createSignal(0)
  const [isDownloadCompleted, setIsDownloadCompleted] = createSignal(false)
  // const [infos, setInfos] = useAtom(infosAtom)
  const [infos, setInfos] = createSignal<Info[]>([])

  const handleDownload = async (info: Info) => {
    const _downloadLink = await window.electronApi.singleDownload({ ...info })
    window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_BY_URL, _downloadLink)
  }

  const handleCheckForUpdate = async () => {
    const _infos = await window.electronApi.checkForUpdate()
    setInfos(Object.values(_infos.results))
  }

  const columnHelper = createColumnHelper<Record<string, unknown>>()
  const columns = createMemo<ColumnDef<Record<string, unknown>, any>[]>(() => [
    columnHelper.accessor('id', selectColumn), // This would be the select column
    // Other required columns
    columnHelper.accessor(info => info, {
      id: 'download',
      // header: () => 'Download',
      header: () => '',
      cell: info => (
        <button class="btn" disabled={downloadFilename() !== ''} onClick={() => handleDownload(info.getValue() as Info)}>
          <IconDownload />
        </button>
      ),
      enableSorting: false
    }),
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
    columnHelper.accessor(() => { }, {
      id: 'progress',
      // header: () => 'Download Status',
      header: () => 'Progress',
      cell: () => (
        <Show when={downloadFilename()}>
          <div>
            {`${downloadFilename()}`}

            <div class="my-1 divider divider-neutral" />

            <div class="flex items-center">
              <progress class="progress progress-accent w-56" value={downloadProgress()} max="100" />

              <span class="whitespace-nowrap px-2">{convertProgress(downloadProgress())}%</span>
            </div>
          </div>
        </Show>
      )
    }),
    columnHelper.accessor(() => { }, {
      id: 'size',
      header: () => 'Size',
      cell: () => (
        <Show when={downloadFilename()}>
          <div>
            <Show when={downloadFilename() && isDownloadCompleted() === false}>
              <span>{convertBytes(downloadReceivedBytes())}</span>

              <div class="my-1 divider divider-neutral" />
            </Show>

            <span>{convertBytes(downloadFilesize())}</span>
          </div>
        </Show>
      )
    }),
    columnHelper.accessor(() => { }, {
      id: 'speed',
      // header: () => 'Transfer Rate',
      header: () => 'Speed',
      cell: () => (
        <Show when={downloadFilename() && isDownloadCompleted() === false}>
          <div>{convertBytes(downloadRateBPS())}/s</div>
        </Show>
      )
    }),
    columnHelper.accessor(() => { }, {
      id: 'eta',
      // header: () => 'Time Left',
      header: () => 'ETA',
      cell: () => (
        <Show when={downloadFilename() && isDownloadCompleted() === false}>
          <div>{convertSecondsToDHMS(timeRemainingSeconds())}</div>
        </Show>
      )
    })
  ])

  createEffect(() => {
    // Listen for the event
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_STARTED, ({
      resolvedFilename,
      totalBytes
    }: DownloadData & { totalBytes: number }) => {
      setDownloadFilename(resolvedFilename)
      setDownloadFilesize(totalBytes)
    })
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_PROGRESS, ({
      downloadRateBytesPerSecond,
      estimatedTimeRemainingSeconds,
      percentCompleted,
      receivedBytes
    }: DownloadData & { receivedBytes: number }) => {
      setDownloadProgress(percentCompleted)
      setDownloadReceivedBytes(receivedBytes)
      setDownloadRateBPS(downloadRateBytesPerSecond)
      setTimeRemainingSeconds(estimatedTimeRemainingSeconds)
    })
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_COMPLETED, () => {
      setIsDownloadCompleted(true)
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