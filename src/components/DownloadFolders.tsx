import { useAtom } from 'solid-jotai'
import type { Component } from 'solid-js'

import { directoryAtom, isDirectoryDisabledAtom } from '../store/atoms'

const DownloadFolders: Component = () => {
  const [directory, setDirectory] = useAtom(directoryAtom)
  const [isDirectoryDisabled, setIsDirectoryDisabled] = useAtom(isDirectoryDisabledAtom)

  const handleSelectDownlaodsFolder = async () => {
    const selectedDownloadFolder = await window.electronApi.selectDownloadFolder()
    setDirectory(selectedDownloadFolder)
  }

  return (
    <div class="grid grid-cols-2 gap-2">
      <div class="items-center flex">
        <span class="whitespace-nowrap font-bold m-1">Downloads Folder:</span>

        <input type="text m-1" class="input input-bordered w-full max-w-xs" value={directory()} disabled={isDirectoryDisabled()} />

        <button class="btn mx-1" onClick={handleSelectDownlaodsFolder}>Change</button>
      </div>

      <div class="flex justify-end">
        <div class="form-control">
          <label class="label cursor-pointer p-0">
            <span class="label-text m-1"><i>Disable</i> "Save in Folder"<br />and <i>enable</i> "Save as"</span>

            <input class="checkbox m-1" type="checkbox" onClick={() => setIsDirectoryDisabled(!isDirectoryDisabled())} />
          </label>
        </div>
      </div>
    </div>
  )
}

export default DownloadFolders