import { createStore } from 'solid-js/store'

import { ALL_CATEGORIES, DEFAULT_CATEGORIES_SELECTED } from '../constants'
import DownloadFolders from './DownloadFolders'
import SelectCategories from './SelectCategories'
import TableContainer from './TableContainer'

type CategoriesChecked = {
  [category in Category]: boolean
}

// enable default or all categories
const initCategoriesToCheck = DEFAULT_CATEGORIES_SELECTED.length === 0 ? ALL_CATEGORIES : DEFAULT_CATEGORIES_SELECTED
const initCategoriesChecked = {} as CategoriesChecked
for (const category of initCategoriesToCheck) {
  initCategoriesChecked[category] = true
}

const UpdatesManager: Component = () => {
  const [categoriesChecked, setCategoriesChecked] = createStore<CategoriesChecked>(initCategoriesChecked)

  return (
    <div>
      <DownloadFolders />

      <SelectCategories categoriesChecked={categoriesChecked} setCategoriesChecked={setCategoriesChecked} />

      <TableContainer categoriesChecked={categoriesChecked} />
    </div>
  )
}

export default UpdatesManager