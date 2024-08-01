import DownloadFolders from './DownloadFolders'
import SelectCategories from './SelectCategories'
import TableContainer from './TableContainer'

const UpdatesManager: Component = () => {
  return (
    <div>
      <DownloadFolders />

      <SelectCategories />

      <TableContainer />
    </div>
  )
}

export default UpdatesManager