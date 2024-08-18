import type { Component } from 'solid-js'

import DownloadFolders from './DownloadFolders'
import SelectCategories from './SelectCategories'
import TableContainer from './TableContainer'
import UpdateConfig from './UpdateConfig'
import UpdateTelegram from './UpdateTelegram'

const UpdatesManager: Component = () => {
  return (
    <div>
      <DownloadFolders />

      <div class="flex justify-end">
        <UpdateTelegram />
      </div>

      <div class="flex justify-end">
        <UpdateConfig />
      </div>

      <SelectCategories />

      <TableContainer />
    </div>
  )
}

export default UpdatesManager