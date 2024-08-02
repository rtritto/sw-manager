import DownloadFolders from './DownloadFolders'
import SelectCategories from './SelectCategories'
import TableContainer from './TableContainer'
import UpdateConfig from './UpdateConfig'

const UpdatesManager: Component = () => {
  return (
    <div>
      <DownloadFolders />

      <UpdateConfig class="absolute right-0" />

      <SelectCategories />

      <TableContainer />
    </div>
  )
}

export default UpdatesManager