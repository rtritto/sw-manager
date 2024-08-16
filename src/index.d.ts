type ValueOf<T> = T[keyof T]

type Channels = ValueOf<typeof import('./constants').CHANNELS>

type Category = keyof (typeof import('./config').default)

type Config = {
  [category in Category]: AppConfig
}

interface Window {
  electronApi: import('@electron-toolkit/preload').ElectronAPI & {
    selectDownloadFolder: () => Promise<string | undefined>
    checkForUpdate: (categories: Category[]) => Promise<Infos>
    singleDownload: (info: Info) => Promise<string>,
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
  [appName: string]: NestedConfig
}

type Version = {
  current: string
  newest?: string
  url?: string
}

type AppResult = {
  [appName: string]: {
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

type Info = {
  appName: string
  website: string
  isVersionUpdated?: boolean
  currentVersion?: string
  newVersion?: string
  imageUrl?: string
  fileUrl?: string
}

type InfoResult = {
  [appName: string]: Info
}

type Infos = {
  [category in Category]?: InfoResult
}

type CategoriesChecked = {
  [category in Category]: boolean
}