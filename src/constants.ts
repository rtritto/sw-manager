export const CHANNELS = {
  // import(electron-updater).UpdaterEvents
  ERROR: 'error',
  UPDATE_AVAILABLE: 'update-available',
  UPDATE_DOWNLOADED: 'update-downloaded',
  UPDATE_NOT_AVAILABLE: 'update-not-available',
  // Custom Channels
  RESTART_APP: 'restart_app',
  CHECK_FOR_UPDATE: 'check_for_update',
  DOWNLOAD_BY_URL: 'download_by_url',
  DOWNLOAD_COMPLETED: 'download-completed',
  DOWNLOAD_PROGRESS: 'download-progress',
  SINGLE_DOWNLOAD: 'single_download',
  UPDATE_ERROR: 'update_error',
} as const

export const EVENTS = {
  ACTIVATE: 'activate',
  READY: 'ready',
  WINDOW_ALL_CLOSED: 'window-all-closed'
} as const