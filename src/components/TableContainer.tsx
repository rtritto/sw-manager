import { createColumnHelper } from '@tanstack/solid-table'
import type { ColumnDef } from '@tanstack/solid-table'
import { IconDownload, IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerStopFilled, IconSearch } from '@tabler/icons-solidjs'
import type { DownloadData } from 'electron-dl-manager'
import { useAtom, useAtomValue } from 'solid-jotai'
import { createEffect, createMemo, createSignal, For, Show, type Component } from 'solid-js'
import { createStore } from 'solid-js/store'

import { CHANNELS, DOWNLOAD_STATUS } from '../constants'
import selectColumn from './selectColumn'
import { convertBytes, convertProgress, convertSecondsToDHMS } from '../utils'
import { categoriesCheckedAtom, directoryAtom, isDirectoryDisabledAtom, rowSelectionAtom, isUpdateConfigEnabledAtom } from '../store/atoms'
import { categoriesCheckedStore } from '../store/stores'
import Table from './Table'

type DownloadStatus = {
  [rowId in string]?: ValueOf<typeof DOWNLOAD_STATUS>
}

type DownloadInfoStart = {
  [rowId in string]?: {
    fileId: string
    fileName: string
    fileSize: number
    appName: string
  }
}

type DownloadInfoProgress = {
  [rowId in string]?: {
    downloadRateBytesPerSecond: number
    estimatedTimeRemainingSeconds: number
    percentCompleted: number
    receivedBytes: number
  }
}

type CatergoriesCollapsed = {
  [category in Category]?: boolean
}

const TableContainer: Component = () => {
  const categoriesChecked = useAtomValue(categoriesCheckedAtom, { store: categoriesCheckedStore })
  const [downloadStatus, setDownloadStatus] = createStore<DownloadStatus>({})
  const [downloadInfoStart, setDownloadInfoStart] = createStore<DownloadInfoStart>({})
  const [downloadInfoProgress, setDownloadInfoProgress] = createStore<DownloadInfoProgress>({})
  const [infos, setInfos] = createSignal<Infos>({})
  const [catergoriesCollapsed, setCatergoriesCollapsed] = createStore<CatergoriesCollapsed>({})
  const [rowSelection, setRowSelection] = useAtom(rowSelectionAtom)
  const directory = useAtomValue(directoryAtom)
  const isDirectoryDisabled = useAtomValue(isDirectoryDisabledAtom)
  const isUpdateConfigEnabled = useAtomValue(isUpdateConfigEnabledAtom)

  const handleCheckForUpdate = async () => {
    const categoriesToCheck: Category[] = []
    for (const categoryChecked in categoriesChecked()) {
      if (categoriesChecked()[categoryChecked] === true) {
        categoriesToCheck.push(categoryChecked as Category)
      }
    }
    const _infos = await window.electronApi.checkForUpdate(categoriesToCheck)
    setRowSelection({})
    setInfos(_infos)
    const _categories = Object.keys(_infos)
    const _catergoriesCollapsed = {}
    for (const category of _categories) {
      _catergoriesCollapsed[category] = true
    }
    setCatergoriesCollapsed(_catergoriesCollapsed)
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleDownloadSelected = async (downloadStatus: DownloadStatus, infos: Infos, rowIds: string[], directory?: string) => {
    const _infos: Info[] = []
    for (const category in infos) {
      _infos.push(...Object.values(infos[category as Category]!))
    }
    await Promise.allSettled(
      rowIds.map((rowId: string) => {
        if ((rowId in downloadStatus) === false || downloadStatus[rowId] === DOWNLOAD_STATUS.CANCEL) {
          const _info = { ..._infos[Number.parseInt(rowId, 10)] }
          return window.electronApi.singleDownload(_info).then((downloadLink) => {
            window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_BY_URL, {
              downloadLink,
              rowId,
              directory,
              appName: _info.appName
            })
          })
        }
      })
    )
  }

  const handlePauseSelected = (downloadStatus: DownloadStatus, downloadInfoStart: DownloadInfoStart, rowIds: string[]) => {
    for (const rowId of rowIds) {
      if (downloadStatus[rowId] === DOWNLOAD_STATUS.DOWNLOADING) {
        window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_PAUSE, downloadInfoStart[rowId]!.fileId)
        setDownloadStatus(rowId, DOWNLOAD_STATUS.PAUSED)
      }
    }
  }

  const handleResumeSelected = (downloadStatus: DownloadStatus, downloadInfoStart: DownloadInfoStart, rowIds: string[]) => {
    for (const rowId of rowIds) {
      if (downloadStatus[rowId] === DOWNLOAD_STATUS.PAUSED) {
        window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_RESUME, downloadInfoStart[rowId]!.fileId)
        setDownloadStatus(rowId, DOWNLOAD_STATUS.DOWNLOADING)
      }
    }
  }

  const handleCancelSelected = (downloadStatus: DownloadStatus, downloadInfoStart: DownloadInfoStart, rowIds: string[]) => {
    for (const rowId of rowIds) {
      if (downloadStatus[rowId] === DOWNLOAD_STATUS.DOWNLOADING || downloadStatus[rowId] === DOWNLOAD_STATUS.PAUSED) {
        window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_CANCEL, downloadInfoStart[rowId]!.fileId)
      }
    }
  }

  const columnHelper = createColumnHelper<Record<string, unknown>>()
  const columns = createMemo<ColumnDef<Record<string, unknown>, any>[]>(() => [
    columnHelper.accessor('id', selectColumn), // This would be the select column
    // Other required columns
    columnHelper.accessor('imageUrl', {
      id: 'imageUrl',
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
        <Show when={info.row.id in downloadInfoStart ? downloadInfoStart[info.row.id]!.fileName !== '' : false}>
          <div>
            {downloadInfoStart[info.row.id]!.fileName}

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
                  value={downloadInfoProgress[info.row.id]!.percentCompleted} max="100"
                />

                <span class="whitespace-nowrap px-2">{convertProgress(downloadInfoProgress[info.row.id]!.percentCompleted)}%</span>
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
        <Show when={info.row.id in downloadInfoStart ? downloadInfoStart[info.row.id]!.fileName !== '' : false}>
          <div>
            <Show
              when={downloadInfoStart[info.row.id]!.fileName
                && (downloadStatus[info.row.id] === DOWNLOAD_STATUS.DOWNLOADING || downloadStatus[info.row.id] === DOWNLOAD_STATUS.PAUSED)}
            >
              <span class="whitespace-nowrap">{convertBytes(downloadInfoProgress[info.row.id]!.receivedBytes)}</span>

              <div class="my-0 h-0.5 divider divider-neutral" />
            </Show>

            <span class="whitespace-nowrap">{convertBytes(downloadInfoStart[info.row.id]!.fileSize)}</span>
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
            ? (downloadInfoStart[info.row.id]!.fileName && downloadStatus[info.row.id] === DOWNLOAD_STATUS.DOWNLOADING)
            : false}
        >
          <div>{convertBytes(downloadInfoProgress[info.row.id]!.downloadRateBytesPerSecond)}/s</div>
        </Show>
      )
    }),
    columnHelper.accessor('', {
      id: 'eta',
      // header: 'Time Left',
      header: 'ETA',
      cell: (info) => (
        <Show when={info.row.id in downloadInfoStart ? (downloadInfoStart[info.row.id]!.fileName && downloadStatus[info.row.id] === DOWNLOAD_STATUS.DOWNLOADING) : false}>
          <div>{convertSecondsToDHMS(downloadInfoProgress[info.row.id]!.estimatedTimeRemainingSeconds)}</div>
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
      totalBytes,
      appName
    }: DownloadData & { rowId: string, totalBytes: number, appName: string }) => {
      setDownloadInfoStart(rowId, {
        fileId: id,
        fileName: resolvedFilename,
        fileSize: totalBytes,
        appName
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
      setDownloadStatus(rowId, DOWNLOAD_STATUS.COMPLETED);
      ((downloadInfoStart, downloadStatus, infos, isUpdateConfigEnabled) => {
        if (isUpdateConfigEnabled === true) {
          const getCompleted = () => {
            const completedAppNames: string[] = []
            for (const rowId in downloadStatus) {
              if (downloadStatus[rowId] === DOWNLOAD_STATUS.COMPLETED) {
                completedAppNames.push(downloadInfoStart[rowId]!.appName)
              } else {
                return
              }
            }
            return completedAppNames
          }
          const completedAppNames = getCompleted()
          if (completedAppNames === undefined) {
            return
          }
          const filteredInfos: Infos = {}
          for (const category in infos) {
            filteredInfos[category] = {}
            for (const completedAppName of completedAppNames) {
              filteredInfos[category][completedAppName] = infos[category][completedAppName]
            }
          }
          window.electronApi.ipcRenderer.send(CHANNELS.UPDATE_CONFIG, filteredInfos)
        }
      })(downloadInfoStart, downloadStatus, infos(), isUpdateConfigEnabled())
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
      <div class="items-center flex">
        <div class="tooltip tooltip-bottom m-1" data-tip="Find Updates">
          <button class="btn" onClick={handleCheckForUpdate}>
            <IconSearch />
          </button>
        </div>

        <div class="tooltip tooltip-bottom m-1" data-tip="Download Selected">
          <button
            class="btn"
            disabled={(Object.keys(rowSelection()).length === 0) || (Object.keys(rowSelection()).some((rowId) =>
              (rowId in downloadStatus) === false || downloadStatus[rowId] === DOWNLOAD_STATUS.CANCEL
            ) === false)}
            onClick={() => handleDownloadSelected(downloadStatus, infos(), Object.keys(rowSelection()), isDirectoryDisabled() === true ? undefined : directory())}
          >
            <IconDownload />
          </button>
        </div>

        <div class="tooltip tooltip-bottom m-1" data-tip="Pause Selected">
          <button
            class="btn"
            disabled={(Object.keys(rowSelection()).length === 0) || (Object.keys(rowSelection()).some((rowId) =>
              (rowId in downloadStatus) === true && downloadStatus[rowId] === DOWNLOAD_STATUS.DOWNLOADING
            ) === false)}
            onClick={() => handlePauseSelected(downloadStatus, downloadInfoStart, Object.keys(rowSelection()))}
          >
            <IconPlayerPauseFilled />
          </button>
        </div>

        <div class="tooltip tooltip-bottom m-1" data-tip="Resume Selected">
          <button
            class="btn"
            disabled={(Object.keys(rowSelection()).length === 0) || (Object.keys(rowSelection()).some((rowId) =>
              (rowId in downloadStatus) === true && downloadStatus[rowId] === DOWNLOAD_STATUS.PAUSED
            ) === false)}
            onClick={() => handleResumeSelected(downloadStatus, downloadInfoStart, Object.keys(rowSelection()))}
          >
            <IconPlayerPlayFilled />
          </button>
        </div>

        <div class="tooltip tooltip-bottom m-1" data-tip="Cancel Selected">
          <button
            class="btn"
            disabled={(Object.keys(rowSelection()).length === 0) || (Object.keys(rowSelection()).some((rowId) =>
              (rowId in downloadStatus) === true && (downloadStatus[rowId] === DOWNLOAD_STATUS.DOWNLOADING || downloadStatus[rowId] === DOWNLOAD_STATUS.PAUSED)
            ) === false)}
            onClick={() => handleCancelSelected(downloadStatus, downloadInfoStart, Object.keys(rowSelection()))}
          >
            <IconPlayerStopFilled />
          </button>
        </div>
      </div>

      <For each={Object.keys(infos())}>
        {(item, index) => (
          <div tabindex={index()} class={`collapse ${catergoriesCollapsed[item] === true ? 'collapse-open' : 'collapse-close'} collapse-arrow border-base-300 bg-base-200 border`}>
            <div class="collapse-title text-xl font-medium" onClick={() => {
              setCatergoriesCollapsed(item as Category, !catergoriesCollapsed[item])
            }}>{item} ({Object.keys(infos()[item]).length})</div>

            <div class="collapse-content">
              <Table columnData={Object.values(infos()[item])} columns={columns()} />
            </div>
          </div>
        )}
      </For>
    </div>
  )
}

export default TableContainer