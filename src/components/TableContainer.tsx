import { createColumnHelper } from '@tanstack/solid-table'
import type { ColumnDef } from '@tanstack/solid-table'
import { IconDownload, IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerStopFilled, IconSearch } from '@tabler/icons-solidjs'
import { useAtom, useAtomValue } from 'solid-jotai'
import { createEffect, createMemo, createSignal, For, Show, type Component } from 'solid-js'
import { createStore } from 'solid-js/store'

import APP_MAP from '../config'
import { CHANNELS, DOWNLOAD_STATUS } from '../constants'
import { convertBytes, convertProgress, convertSecondsToDHMS } from '../utils'
import { categoriesCheckedAtom, checkedAppNamesAtom, directoryAtom, isDirectoryDisabledAtom, isUpdateConfigEnabledAtom, isUpdateTelegramEnabledAtom } from '../store/atoms'
import { categoriesCheckedStore, checkedAppNamesStore } from '../store/stores'
import selectColumn from './selectColumn'
import Table from './Table'
import { disabledCancelSelected, disabledDownloadSelected, disabledPauseSelected, disabledResumeSelected } from './TableContainer-disabled'

type DownloadInfoStart = {
  [appName in string]?: {
    fileId: string
    fileName: string
    fileSize: number
    appName: AppName
  }
}

type DownloadInfoProgress = {
  [appName in string]?: {
    downloadRateBytesPerSecond: DownloadData['downloadRateBytesPerSecond']
    estimatedTimeRemainingSeconds: DownloadData['estimatedTimeRemainingSeconds']
    percentCompleted: DownloadData['percentCompleted']
    receivedBytes: ReturnType<DownloadItem['getReceivedBytes']>
  }
}

type CatergoriesCollapsed = {
  [category in Category]?: boolean
}

type CellInfo = {
  row: {
    original: Info
  }
}

const TableContainer: Component = () => {
  const categoriesChecked = useAtomValue(categoriesCheckedAtom, { store: categoriesCheckedStore })
  const [checkedAppNames, setCheckedAppNames] = useAtom(checkedAppNamesAtom, { store: checkedAppNamesStore })
  const [downloadStatus, setDownloadStatus] = createStore<DownloadStatus>({})
  const [downloadInfoStart, setDownloadInfoStart] = createStore<DownloadInfoStart>({})
  const [downloadInfoProgress, setDownloadInfoProgress] = createStore<DownloadInfoProgress>({})
  const [infos, setInfos] = createSignal<Infos>({})
  const [catergoriesCollapsed, setCatergoriesCollapsed] = createStore<CatergoriesCollapsed>({})
  const directory = useAtomValue(directoryAtom)
  const isDirectoryDisabled = useAtomValue(isDirectoryDisabledAtom)
  const isUpdateConfigEnabled = useAtomValue(isUpdateConfigEnabledAtom)
  const isUpdateTelegramEnabled = useAtomValue(isUpdateTelegramEnabledAtom)

  const handleCheckForUpdate = async () => {
    const categoriesToCheck: Category[] = []
    for (const categoryChecked in categoriesChecked()) {
      if (categoriesChecked()[categoryChecked] === true) {
        categoriesToCheck.push(categoryChecked as Category)
      }
    }
    const _infos = await window.electronApi.checkForUpdate(categoriesToCheck)
    setCheckedAppNames({} as CheckedAppNames)
    setInfos(_infos)
    const _categories = Object.keys(_infos)
    const _catergoriesCollapsed = {}
    for (const category of _categories) {
      _catergoriesCollapsed[category] = true
    }
    setCatergoriesCollapsed(_catergoriesCollapsed)
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleDownloadSelected = async (downloadStatus: DownloadStatus, infos: Infos, checkedAppNames: CheckedAppNames, directory?: string) => {
    await Promise.allSettled(
      Object.keys(checkedAppNames).map((category) => checkedAppNames[category as Category].map((appName) => {
        if ((appName in downloadStatus) === false || downloadStatus[appName] === DOWNLOAD_STATUS.CANCEL) {
          return window.electronApi.singleDownload(infos[category as Category]![appName]).then((downloadLink) => {
            window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_BY_URL, {
              appName,
              downloadLink,
              directory,
              version: infos[category as Category]![appName].newVersion
            } as DownloadByUrlArgs)
          })
        }
      }))
    )
  }

  const handlePauseSelected = (downloadStatus: DownloadStatus, downloadInfoStart: DownloadInfoStart, checkedAppNames: CheckedAppNames) => {
    const appNamesList = Object.values(checkedAppNames)
    for (const appNames of appNamesList) {
      for (const appName of appNames) {
        if (downloadStatus[appName] === DOWNLOAD_STATUS.DOWNLOADING) {
          window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_PAUSE, downloadInfoStart[appName]!.fileId)
          setDownloadStatus(appName, DOWNLOAD_STATUS.PAUSED)
        }
      }
    }
  }

  const handleResumeSelected = (downloadStatus: DownloadStatus, downloadInfoStart: DownloadInfoStart, checkedAppNames: CheckedAppNames) => {
    const appNamesList = Object.values(checkedAppNames)
    for (const appNames of appNamesList) {
      for (const appName of appNames) {
        if (downloadStatus[appName] === DOWNLOAD_STATUS.PAUSED) {
          window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_RESUME, downloadInfoStart[appName]!.fileId)
          setDownloadStatus(appName, DOWNLOAD_STATUS.DOWNLOADING)
        }
      }
    }
  }

  const handleCancelSelected = (downloadStatus: DownloadStatus, downloadInfoStart: DownloadInfoStart, checkedAppNames: CheckedAppNames) => {
    const appNamesList = Object.values(checkedAppNames)
    for (const appNames of appNamesList) {
      for (const appName of appNames) {
        if (downloadStatus[appName] === DOWNLOAD_STATUS.DOWNLOADING || downloadStatus[appName] === DOWNLOAD_STATUS.PAUSED) {
          window.electronApi.ipcRenderer.send(CHANNELS.DOWNLOAD_CANCEL, downloadInfoStart[appName]!.fileId)
        }
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
      cell: (info: CellInfo) => {
        const { row: { original: { appName } } } = info
        return (
          <Show when={appName in downloadInfoStart ? downloadInfoStart[appName]!.fileName !== '' : false}>
            <div>
              {downloadInfoStart[appName]!.fileName}

              <Show
                when={downloadStatus[appName] === DOWNLOAD_STATUS.DOWNLOADING
                  || downloadStatus[appName] === DOWNLOAD_STATUS.PAUSED
                  || downloadStatus[appName] === DOWNLOAD_STATUS.COMPLETED}
              >
                <div class="my-0 h-0.5 divider divider-neutral" />

                <div class="flex items-center">
                  <progress
                    class={`progress ${downloadStatus[appName] === DOWNLOAD_STATUS.DOWNLOADING
                      ? 'progress-info'
                      : (downloadStatus[appName] === DOWNLOAD_STATUS.PAUSED ? 'progress-warning' : 'progress-accent')} w-56`}
                    value={downloadInfoProgress[appName]!.percentCompleted} max="100"
                  />

                  <span class="whitespace-nowrap px-2">{convertProgress(downloadInfoProgress[appName]!.percentCompleted)}%</span>
                </div>
              </Show>
            </div>
          </Show>
        )
      }
    }),
    columnHelper.accessor('', {
      id: 'size',
      header: 'Size',
      cell: (info: CellInfo) => {
        const { row: { original: { appName } } } = info
        return (
          <Show when={appName in downloadInfoStart ? downloadInfoStart[appName]!.fileName !== '' : false}>
            <div>
              <Show
                when={downloadInfoStart[appName]!.fileName
                  && (downloadStatus[appName] === DOWNLOAD_STATUS.DOWNLOADING || downloadStatus[appName] === DOWNLOAD_STATUS.PAUSED)}
              >
                <span class="whitespace-nowrap">{convertBytes(downloadInfoProgress[appName]!.receivedBytes)}</span>

                <div class="my-0 h-0.5 divider divider-neutral" />
              </Show>

              <span class="whitespace-nowrap">{convertBytes(downloadInfoStart[appName]!.fileSize)}</span>
            </div>
          </Show>
        )
      }
    }),
    columnHelper.accessor('', {
      id: 'speed',
      // header: 'Transfer Rate',
      header: 'Speed',
      cell: (info: CellInfo) => {
        const { row: { original: { appName } } } = info
        return (
          <Show
            when={appName in downloadInfoStart
              ? (downloadInfoStart[appName]!.fileName && downloadStatus[appName] === DOWNLOAD_STATUS.DOWNLOADING)
              : false}
          >
            <div>{convertBytes(downloadInfoProgress[appName]!.downloadRateBytesPerSecond)}/s</div>
          </Show>
        )
      }
    }),
    columnHelper.accessor('', {
      id: 'eta',
      // header: 'Time Left',
      header: 'ETA',
      cell: (info: CellInfo) => {
        const { row: { original: { appName } } } = info
        return (
          <Show when={appName in downloadInfoStart ? (downloadInfoStart[appName]!.fileName && downloadStatus[appName] === DOWNLOAD_STATUS.DOWNLOADING) : false}>
            <div>{convertSecondsToDHMS(downloadInfoProgress[appName]!.estimatedTimeRemainingSeconds)}</div>
          </Show>
        )
      }
    })
  ])

  createEffect(() => {
    // Listen for the event
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_STARTED, (_, {
      appName,
      id,
      resolvedFilename,
      totalBytes
    }: DownloadStartedArgs) => {
      setDownloadInfoStart(appName, {
        fileId: id,
        fileName: resolvedFilename,
        fileSize: totalBytes,
        appName
      })
      setDownloadStatus(appName, DOWNLOAD_STATUS.STARTED)
    })
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_PROGRESS, (_, {
      appName,
      downloadRateBytesPerSecond,
      estimatedTimeRemainingSeconds,
      percentCompleted,
      receivedBytes
    }: DownloadProgressArgs) => {
      setDownloadInfoProgress(appName, {
        downloadRateBytesPerSecond,
        estimatedTimeRemainingSeconds,
        percentCompleted,
        receivedBytes
      })
      setDownloadStatus(appName, DOWNLOAD_STATUS.DOWNLOADING)
    })
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_COMPLETED, (_, { appName }: DownloadCompletedArgs) => {
      setDownloadStatus(appName, DOWNLOAD_STATUS.COMPLETED);
      ((downloadInfoStart, downloadStatus, infos, isUpdateConfigEnabled, isUpdateTelegramEnabled, directory) => {
        if (isUpdateTelegramEnabled() === true || isUpdateConfigEnabled() === true) {
          const getCompleted = () => {
            const completedAppNames: string[] = []
            for (const appName in downloadStatus) {
              if (downloadStatus[appName] === DOWNLOAD_STATUS.COMPLETED) {
                completedAppNames.push(downloadInfoStart[appName]!.appName)
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
          for (const category in infos()) {
            filteredInfos[category] = {}
            for (const completedAppName of completedAppNames) {
              filteredInfos[category][completedAppName] = infos()[category][completedAppName]
            }
          }

          const filteredConfig = {} as Config
          for (const category in filteredInfos) {
            filteredConfig[category as Category] = {}
            for (const appName in filteredInfos[category as Category]) {
              // Update APP_MAP
              const { newVersion } = filteredInfos[category as Category]![appName]
              APP_MAP[category as Category][appName].version = newVersion

              // Get filtered Config
              filteredConfig[category as Category][appName] = APP_MAP[category as Category][appName]
            }
          }

          if (isUpdateTelegramEnabled() === true) {
            window.electronApi.ipcRenderer.send(CHANNELS.UPDATE_TELEGRAM, filteredConfig, directory())
          }
          if (isUpdateConfigEnabled() === true) {
            window.electronApi.ipcRenderer.send(CHANNELS.UPDATE_CONFIG, APP_MAP)
          }
        }
      })(downloadInfoStart, downloadStatus, infos, isUpdateConfigEnabled, isUpdateTelegramEnabled, directory)
    })
    window.electronApi.ipcRenderer.on(CHANNELS.DOWNLOAD_CANCEL, (_, { appName }: DownloadCancelArgs) => {
      setDownloadInfoProgress(appName, {
        downloadRateBytesPerSecond: 0,
        estimatedTimeRemainingSeconds: 0,
        percentCompleted: 0,
        receivedBytes: 0
      })
      setDownloadStatus(appName, DOWNLOAD_STATUS.CANCEL)
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
            disabled={disabledDownloadSelected(checkedAppNames(), downloadStatus)}
            onClick={() => handleDownloadSelected(downloadStatus, infos(), checkedAppNames(), isDirectoryDisabled() === true ? undefined : directory())}
          >
            <IconDownload />
          </button>
        </div>

        <div class="tooltip tooltip-bottom m-1" data-tip="Pause Selected">
          <button
            class="btn"
            disabled={disabledPauseSelected(checkedAppNames(), downloadStatus)}
            onClick={() => handlePauseSelected(downloadStatus, downloadInfoStart, checkedAppNames())}
          >
            <IconPlayerPauseFilled />
          </button>
        </div>

        <div class="tooltip tooltip-bottom m-1" data-tip="Resume Selected">
          <button
            class="btn"
            disabled={disabledResumeSelected(checkedAppNames(), downloadStatus)}
            onClick={() => handleResumeSelected(downloadStatus, downloadInfoStart, checkedAppNames())}
          >
            <IconPlayerPlayFilled />
          </button>
        </div>

        <div class="tooltip tooltip-bottom m-1" data-tip="Cancel Selected">
          <button
            class="btn"
            disabled={disabledCancelSelected(checkedAppNames(), downloadStatus)}
            onClick={() => handleCancelSelected(downloadStatus, downloadInfoStart, checkedAppNames())}
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
              <Table columnData={Object.values(infos()[item])} columns={columns()} item={item} />
            </div>
          </div>
        )}
      </For>
    </div>
  )
}

export default TableContainer