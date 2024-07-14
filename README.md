# Install
`yarn`

# Start
`yarn start`

# TODO
- add support for multiple donwload
- add bar on top to manage download
- auto-install (silent install/extract) for apps and Portable apps (use a folder like `/Portable`)
- update and upload apps on Telegram
- install and config `electron-builder`, see
  - https://github.com/theogravity/electron-dl-manager/tree/main/test-app
  - https://github.com/spa5k/quran_next

# Bugs
- Support PnP (remove patch of `@electron-forge/core-utils` and `@electron-forge/core`):
  - https://github.com/electron/forge/pull/3209
  - https://github.com/electron/forge/issues/3611
- ESM support / Read internal dependencies (in next step, _dev deps_ will be moved to _deps_):
  - https://github.com/electron/forge/pull/3582
  - https://github.com/electron/forge/issues/3644