import APP_MAP from './config'

export enum CHANNELS {
  // import(electron-updater).UpdaterEvents
  ERROR = 'error',
  UPDATE_AVAILABLE = 'update-available',
  UPDATE_DOWNLOADED = 'update-downloaded',
  UPDATE_NOT_AVAILABLE = 'update-not-available',
  // Custom Channels
  RESTART_APP = 'restart_app',
  CHECK_FOR_UPDATE = 'check_for_update',
  DOWNLOAD_BY_URL = 'download_by_url',
  DOWNLOAD_CANCEL = 'download-cancel',
  DOWNLOAD_COMPLETED = 'download-completed',
  DOWNLOAD_PAUSE = 'download-pause',
  DOWNLOAD_PROGRESS = 'download-progress',
  DOWNLOAD_RESUME = 'download-resume',
  DOWNLOAD_STARTED = 'download-started',
  SINGLE_DOWNLOAD = 'single_download',
  SELECT_DOWNLOAD_FOLDER = 'single_download_folder',
  UPDATE_ERROR = 'update_error',
  UPDATE_CONFIG = 'update_config',
  UPDATE_TELEGRAM = 'update_telegram'
}

export enum DOWNLOAD_STATUS {
  STARTED = CHANNELS.DOWNLOAD_STARTED,
  DOWNLOADING = CHANNELS.DOWNLOAD_PROGRESS,
  PAUSED = CHANNELS.DOWNLOAD_PAUSE,
  COMPLETED = CHANNELS.DOWNLOAD_COMPLETED,
  CANCEL = CHANNELS.DOWNLOAD_CANCEL
}

export enum EVENTS {
  ACTIVATE = 'activate',
  READY = 'ready',
  WINDOW_ALL_CLOSED = 'window-all-closed'
}

export const DEFAULT_CATEGORIES_SELECTED = ['SO']

export const ALL_CATEGORIES = Object.keys(APP_MAP)