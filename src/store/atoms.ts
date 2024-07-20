import type { RowSelectionState } from '@tanstack/solid-table'
import { atom } from 'solid-jotai'

export const showNotificationAtom = atom<boolean>(false)
export const showRestartButtonAtom = atom<boolean>(false)
export const messageAtom = atom<string>('')
export const rowSelectionAtom = atom<RowSelectionState>({})
export const directoryAtom = atom<string>()