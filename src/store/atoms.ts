import { atom } from 'solid-jotai'

import { ALL_CATEGORIES, DEFAULT_CATEGORIES_SELECTED } from '../constants'

export const showNotificationAtom = atom<boolean>(false)
export const showRestartButtonAtom = atom<boolean>(false)
export const messageAtom = atom<string>('')
export const directoryAtom = atom<string>()
export const isDirectoryDisabledAtom = atom<boolean>(false)
export const isUpdateConfigEnabledAtom = atom<boolean>(true)
export const isUpdateTelegramEnabledAtom = atom<boolean>(true)

// enable default or all categories
const initCategoriesToCheck = DEFAULT_CATEGORIES_SELECTED.length === 0 ? ALL_CATEGORIES : DEFAULT_CATEGORIES_SELECTED
const initCategoriesChecked = {} as CategoriesChecked
for (const category of initCategoriesToCheck) {
  initCategoriesChecked[category] = true
}

export const categoriesCheckedAtom = atom<CategoriesChecked>(initCategoriesChecked)

export const checkedAppNamesAtom = atom<CheckedAppNames>({} as CheckedAppNames)