import { IconFolderCog } from '@tabler/icons-solidjs'
import { useAtom } from 'solid-jotai'
import type { Component } from 'solid-js'

import { directoryAtom } from '../store/atoms'
import handleOpenFolder from './handleClick/handleOpenFolder'
import { FolderOpenIcon } from './Icons'

const DownloadFolders: Component = () => {
  const [directory, setDirectory] = useAtom(directoryAtom)

  const handleSelectDownlaodsFolder = async () => {
    const defaultDownloadsFolder = globalThis.electronApi.downloadsFolder
    const selectedDownloadsFolder = await globalThis.electronApi.selectDownloadFolder(defaultDownloadsFolder)
    setDirectory(selectedDownloadsFolder)
  }

  return (
    <span class="flex items-center">
      <span class="m-1 whitespace-nowrap font-bold">Downloads Folder:</span>

      <input type="text m-1" class="input input-bordered w-full" value={directory()} onChange={(e) => setDirectory(e.target.value)} />

      <div class="tooltip tooltip-bottom m-1" data-tip="Open Downloads folder">
        <button class="btn mx-1" onClick={() => handleOpenFolder(directory())}><FolderOpenIcon /></button>
        {/*  btn-sm */}
      </div>

      <div class="tooltip tooltip-bottom m-1" data-tip="Change Downloads folder">
        <button class="btn mx-1" onClick={handleSelectDownlaodsFolder}><IconFolderCog /></button>
      </div>
    </span>
  )
}

export default DownloadFolders