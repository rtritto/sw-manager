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

type DownloadInfoStart = {
  [rowId: string]: {
    fileId: string
    fileName: string
    fileSize: number
  }
}

type DownloadInfoProgress = {
  [rowId: string]: {
    downloadRateBytesPerSecond: number
    estimatedTimeRemainingSeconds: number
    percentCompleted: number
    receivedBytes: number
  }
}

const UpdatesManager: Component = () => {
  const [downloadStatus, setDownloadStatus] = createStore<{ [rowId: string]: ValueOf<typeof DOWNLOAD_STATUS> }>({})
  const [downloadInfoStart, setDownloadInfoStart] = createStore<DownloadInfoStart>({})
  const [downloadInfoProgress, setDownloadInfoProgress] = createStore<DownloadInfoProgress>({})
  const [infos, setInfos] = createSignal<Info[]>([])
  const [rowSelection, setRowSelection] = useAtom(rowSelectionAtom)
  const [directory, setDirectory] = useAtom(directoryAtom)
  const [isDirectoryDisabled, setIsDirectoryDisabled] = createSignal<boolean>(false)

  const handleSelectDownlaodsFolder = async () => {
    const _selectedDownloadFolder = await window.electronApi.selectDownloadFolder()
    setDirectory(_selectedDownloadFolder === undefined ? window.electronApi.downloadsFolder : _selectedDownloadFolder)
  }

  const handleCheckForUpdate = async () => {
    const _infos = await window.electronApi.checkForUpdate()
    setRowSelection({})
    setInfos(Object.values(_infos.results))
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleDownloadSelected = async (infos: Info[], rowIds: string[], directory?: string) => {
    await Promise.all(
      rowIds.map((rowId: string) => window.electronApi.singleDownload({ ...infos[Number.parseInt(rowId, 10)] }).then((downloadLink) => {
        window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_BY_URL, {
          downloadLink,
          rowId,
          directory
        })
      }))
    )
  }

  const handlePauseSelected = (downloadInfoStart: DownloadInfoStart, rowIds: string[]) => {
    for (const rowId of rowIds) {
      window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_PAUSE, downloadInfoStart[rowId].fileId)
      setDownloadStatus(rowId, DOWNLOAD_STATUS.PAUSED)
    }
  }

  const handleResumeSelected = (downloadInfoStart: DownloadInfoStart, rowIds: string[]) => {
    for (const rowId of rowIds) {
      window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_RESUME, downloadInfoStart[rowId].fileId)
      setDownloadStatus(rowId, DOWNLOAD_STATUS.DOWNLOADING)
    }
  }

  const handleCancelSelected = (downloadInfoStart: DownloadInfoStart, rowIds: string[]) => {
    for (const rowId of rowIds) {
      window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_CANCEL, downloadInfoStart[rowId].fileId)
    }
  }

  const columnHelper = createColumnHelper<Record<string, unknown>>()
  const columns = createMemo<ColumnDef<Record<string, unknown>, any>[]>(() => [
    columnHelper.accessor('id', selectColumn), // This would be the select column
    // Other required columns
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
        <span class="whitespace-nowrap font-bold m-1">Downloads Folder:</span>

        <input type="text m-1" class="input input-bordered w-full max-w-xs" value={directory()} disabled={isDirectoryDisabled()} />

        <button class="btn m-1" onClick={handleSelectDownlaodsFolder}>Change</button>

        <div class="form-control">
          <label class="label cursor-pointer">
            <input class="checkbox m-1" type="checkbox" onClick={() => setIsDirectoryDisabled(!isDirectoryDisabled())} />

            <span class="label-text m-1">Disable Folder<br />to enable "Save as"</span>
          </label>
        </div>
      </div>

      <div class="btn-group btn-group-horizontal items-center flex">
        <button class="btn" onClick={handleCheckForUpdate}>
          <IconSearch />
        </button>

        <div class="tooltip" data-tip="Download Selected">
          <button
            class="btn"
            disabled={(Object.keys(rowSelection()).length === 0) || (Object.keys(rowSelection()).some((rowId) =>
              (rowId in downloadStatus) === false || downloadStatus[rowId] === DOWNLOAD_STATUS.COMPLETED || downloadStatus[rowId] === DOWNLOAD_STATUS.CANCEL
            ) === false)}
            onClick={() => handleDownloadSelected(infos(), Object.keys(rowSelection()), isDirectoryDisabled() === true ? undefined : directory())}
          >
            <IconDownload />
          </button>

          <button
            class="btn"
            disabled={Object.values(downloadStatus).includes(DOWNLOAD_STATUS.DOWNLOADING) === false}
            onClick={() => handlePauseSelected(downloadInfoStart, Object.keys(rowSelection()))}
          >
            <IconPlayerPauseFilled />
          </button>

          <button
            class="btn"
            disabled={Object.values(downloadStatus).includes(DOWNLOAD_STATUS.PAUSED) === false}
            onClick={() => handleResumeSelected(downloadInfoStart, Object.keys(rowSelection()))}
          >
            <IconPlayerPlayFilled />
          </button>

          <button
            class="btn"
            disabled={Object.values(downloadStatus).some((status) =>
              status === DOWNLOAD_STATUS.DOWNLOADING || status === DOWNLOAD_STATUS.PAUSED
            ) === false}
            onClick={() => handleCancelSelected(downloadInfoStart, Object.keys(rowSelection()))}
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