import type { RowSelectionState } from '@tanstack/solid-table'
import { atom } from 'solid-jotai'

import { ALL_CATEGORIES, DEFAULT_CATEGORIES_SELECTED } from '../constants'

export const showNotificationAtom = atom<boolean>(false)
export const showRestartButtonAtom = atom<boolean>(false)
export const messageAtom = atom<string>('')
export const rowSelectionAtom = atom<RowSelectionState>({})
export const directoryAtom = atom<string>()
export const isDirectoryDisabledAtom = atom<boolean>(false)

// enable default or all categories
const initCategoriesToCheck = DEFAULT_CATEGORIES_SELECTED.length === 0 ? ALL_CATEGORIES : DEFAULT_CATEGORIES_SELECTED
const initCategoriesChecked = {} as CategoriesChecked
for (const category of initCategoriesToCheck) {
  initCategoriesChecked[category] = true
}

export const categoriesCheckedAtom = atom<CategoriesChecked>(initCategoriesChecked)