# Install
`yarn`

# Start
`yarn start`

# TODO
- Auto-install (silent install/extract) for apps and Portable apps (use a folder like `/Portable`)
- Update and upload apps on Telegram
- Install and config `electron-builder`, see
  - https://github.com/theogravity/electron-dl-manager/tree/main/test-app
  - https://github.com/spa5k/quran_next
- Add restart download
- Set size for imageUrl (es: Microsoft Activation Scripts)
- Fix version XAMP
- Add absolute imports
- Add black list to ignore app from config file
- Click to Check or Uncheck
- Click A Shift Click C to Check A - B - C

# Bugs
- Support PnP (remove patch of `@electron-forge/core-utils` and `@electron-forge/core`):
  - https://github.com/electron/forge/pull/3209
  - https://github.com/electron/forge/issues/3611
- ESM support / Read internal dependencies (in next step, _dev deps_ will be moved to _deps_):
  - remove .cts in .eslintrc.yml
  - https://github.com/electron/forge/pull/3582
  - https://github.com/electron/forge/issues/3644