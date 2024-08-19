import { useAtom } from 'solid-jotai'
import type { Component } from 'solid-js'

import { directoryAtom } from '../store/atoms'

const DownloadFolders: Component = () => {
  const [directory, setDirectory] = useAtom(directoryAtom)

  const handleSelectDownlaodsFolder = async () => {
    const selectedDownloadFolder = await window.electronApi.selectDownloadFolder()
    setDirectory(selectedDownloadFolder)
  }

  return (
    <div class="grid grid-cols-2 gap-2">
      <div class="items-center flex">
        <span class="whitespace-nowrap font-bold m-1">Downloads Folder:</span>

        <input type="text m-1" class="input input-bordered w-full max-w-xs" value={directory()} />

        <button class="btn mx-1" onClick={handleSelectDownlaodsFolder}>Change</button>
      </div>

      {/* Missing second column */}
    </div>
  )
}

export default DownloadFolders