import { DOWNLOAD_STATUS } from '../constants'

export const disabledDownloadSelected = (checkedAppNames: CheckedAppNames, downloadStatus: DownloadStatus): boolean => {
  const keys = Object.keys(checkedAppNames)
  if (keys.length === 0) {
    return true
  }
  for (const key of keys) {
    const appNames = checkedAppNames[key]
    for (const appName of appNames) {
      if (appName in downloadStatus === false || downloadStatus[appName] === DOWNLOAD_STATUS.CANCEL) {
        return false
      }
    }
  }
  return true
}

export const disabledPauseSelected = (checkedAppNames: CheckedAppNames, downloadStatus: DownloadStatus): boolean => {
  const keys = Object.keys(checkedAppNames)
  if (keys.length === 0) {
    return true
  }
  for (const key of keys) {
    const appNames = checkedAppNames[key]
    for (const appName of appNames) {
      if (downloadStatus[appName] === DOWNLOAD_STATUS.DOWNLOADING) {
        return false
      }
    }
  }
  return true
}

export const disabledResumeSelected = (checkedAppNames: CheckedAppNames, downloadStatus: DownloadStatus): boolean => {
  const keys = Object.keys(checkedAppNames)
  if (keys.length === 0) {
    return true
  }
  for (const key of keys) {
    const appNames = checkedAppNames[key]
    for (const appName of appNames) {
      if (downloadStatus[appName] === DOWNLOAD_STATUS.PAUSED) {
        return false
      }
    }
  }
  return true
}

export const disabledCancelSelected = (checkedAppNames: CheckedAppNames, downloadStatus: DownloadStatus): boolean => {
  const keys = Object.keys(checkedAppNames)
  if (keys.length === 0) {
    return true
  }
  for (const key of keys) {
    const appNames = checkedAppNames[key]
    for (const appName of appNames) {
      if (downloadStatus[appName] === DOWNLOAD_STATUS.DOWNLOADING || downloadStatus[appName] === DOWNLOAD_STATUS.PAUSED) {
        return false
      }
    }
  }
  return true
}