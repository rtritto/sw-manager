type ValueOf<T> = T[keyof T]

type Channels = ValueOf<typeof import('./constants').CHANNELS>

interface Window {
  electronApi: import('@electron-toolkit/preload').ElectronAPI & {
    selectDownloadFolder: () => Promise<string>
    checkForUpdate: () => Promise<{
      results: InfoResult
      error: Error
    }>
    singleDownload: (info: Info) => Promise<string>
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
}

type AppConfig = {
  [appName: string]: NestedConfig
}

type Config = {
  [category: string]: AppConfig
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
  [category: string]: AppResult
}

type Info = {
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

type Component = import('solid-js').Component