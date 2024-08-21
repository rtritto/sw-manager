import { useAtom } from 'solid-jotai'
import type { Component } from 'solid-js'

import { directoryAtom } from '../store/atoms'

const DownloadFolders: Component = () => {
  const [directory, setDirectory] = useAtom(directoryAtom)

  const handleSelectDownlaodsFolder = async () => {
    const defaultDownloadsFolder = window.electronApi.downloadsFolder
    const selectedDownloadFolder = await window.electronApi.selectDownloadFolder(defaultDownloadsFolder)
    setDirectory(selectedDownloadFolder)
  }

  const handleOpenDownlaodsFolder = async () => {
    await window.electronApi.openFolder(directory(), false)
  }

  return (
    <span class="items-center flex">
      <span class="whitespace-nowrap font-bold m-1">Downloads Folder:</span>

      <input type="text m-1" class="input input-bordered w-full" value={directory()} onChange={(e) => setDirectory(e.target.value)} />

      <button class="btn mx-1" onClick={handleSelectDownlaodsFolder}>Change</button>

      <button class="btn mx-1" onClick={handleOpenDownlaodsFolder}>Open</button>
    </span>
  )
}

export default DownloadFolders