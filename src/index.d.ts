type ValueOf<T> = T[keyof T]

type Channels = ValueOf<typeof import('./constants').CHANNELS>

type Category = keyof (typeof import('./config').default)

type DownloadData = import('electron-dl-manager').DownloadData

type DownloadItem = import('electron').DownloadItem

type Config = {
  [category in Category]: AppConfig
}

type UpdateTelegramReturn = Promise<Config | undefined>

interface Window {
  electronApi: import('@electron-toolkit/preload').ElectronAPI & {
    selectDownloadFolder: (defaultDownloadsFolder: string) => Promise<string>
    checkForUpdate: (categories: Category[]) => Promise<Infos>
    singleDownload: (info: Info) => Promise<string>,
    updateTelegram: (filteredConfig: Config, directory: string, originalConfig: Config) => UpdateTelegramReturn
    downloadsFolder: string
  }
}

type GithubTag = {
  name: string
  tag_name: string
  assets: {
    [assetNumber: number]: {
      browser_download_url: string
    }
  }
}
type GithubTags = GithubTag[]

type VersionOptions = {
  title?: string
  download?: string
}

type NestedConfig = {
  id?: number
  childNumber?: number
  url?: string
  urlTmp?: string
  urlTmp1?: string
  urlTmp2?: string
  download?: string
  downloadTmp?: string
  imageUrl?: string
  owner?: string
  repo?: string
  assetNumber?: number
  tagNumber?: number
  version: string
  versionOptions?: VersionOptions
  website: string
  websiteTmp?: string
  comment?: string
  telegram?: Telegram
}

type AppConfig = {
  [appName: AppName]: NestedConfig
}

type Version = {
  current: string
  newest?: string
  url?: string
}

type AppResult = {
  [appName: AppName]: {
    version: Version
  }
}

type Results = {
  [category in Category]?: AppResult
}

type Telegram = {
  messageId?: number
  tags?: string[]
}

type DocumentInfo = {
  path: string
  name: string
}

type AppName = string

type Info = {
  appName: AppName
  website: string
  isVersionUpdated?: boolean
  currentVersion?: string
  newVersion?: string
  imageUrl?: string
  fileUrl?: string
}

type InfoResult = {
  [appName: AppName]: Info
}

type Infos = {
  [category in Category]?: InfoResult
}

type CategoriesChecked = {
  [category in Category]: boolean
}

type CheckedAppNames = {
  [category in Category]: AppName[]
}

type DownloadStatus = {
  [appName in string]?: ValueOf<typeof import('./constants').DOWNLOAD_STATUS>
}

type DownloadByUrlArgs = {
  appName: AppName
  category: Category
  downloadLink: string
  directory: string
  version: string
}

type DownloadStartedArgs = {
  appName: AppName
  id: DownloadData['id']
  resolvedFilename: DownloadData['resolvedFilename']
  totalBytes: ReturnType<DownloadItem['getReceivedBytes']>
}

type DownloadProgressArgs = {
  appName: AppName
  downloadRateBytesPerSecond: DownloadData['downloadRateBytesPerSecond']
  estimatedTimeRemainingSeconds: DownloadData['estimatedTimeRemainingSeconds']
  percentCompleted: DownloadData['percentCompleted']
  receivedBytes: ReturnType<DownloadItem['getReceivedBytes']>
}

type DownloadCompletedArgs = {
  appName: AppName
  id: DownloadData['id']
}

type DownloadCancelArgs = {
  appName: AppName
  id: DownloadData['id']
}