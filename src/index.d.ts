interface Window {
  electron: {
    ipcRenderer: import('electron').IpcRenderer
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

type Config = {
  [type: string]: {
    [type2: string]: NestedConfig
  }
}

type Version = {
  current: string
  newest?: string
  url?: string
}

type Results = {
  [type: string]: {
    [type2: string]: {
      version: Version
    }
  }
}