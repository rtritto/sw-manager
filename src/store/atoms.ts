import { atom } from 'solid-jotai'

export const showNotificationAtom = atom<boolean>(false)
export const showRestartButtonAtom = atom<boolean>(false)
export const messageAtom = atom<string>('')