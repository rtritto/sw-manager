interface Window {
  electronApi: {
    ipcRenderer: import('electron').IpcRenderer,
    checkForUpdate: () => Promise<{
      results: InfoResult,
      error: Error
    }>
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
  evaluate: string
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
  isVersionUpdated?: boolean
  currentVersion?: string
  newVersion?: string
  fileUrl?: string
  imageUrl?: string
}

type InfoResult = {
  [appName: string]: Info
}

type Component = import('solid-js').Component