import { useAtom } from 'solid-jotai'

import { directoryAtom, isDirectoryDisabledAtom } from '../store/atoms'

const DownloadFolders: Component = () => {
  const [directory, setDirectory] = useAtom(directoryAtom)
  const [isDirectoryDisabled, setIsDirectoryDisabled] = useAtom(isDirectoryDisabledAtom)

  const handleSelectDownlaodsFolder = async () => {
    const _selectedDownloadFolder = await window.electronApi.selectDownloadFolder()
    setDirectory(_selectedDownloadFolder === undefined ? window.electronApi.downloadsFolder : _selectedDownloadFolder)
  }

  return (
    <div class="items-center flex">
      <span class="whitespace-nowrap font-bold m-1">Downloads Folder:</span>

      <input type="text m-1" class="input input-bordered w-full max-w-xs" value={directory()} disabled={isDirectoryDisabled()} />

      <button class="btn m-1" onClick={handleSelectDownlaodsFolder}>Change</button>

      <div class="form-control">
        <label class="label cursor-pointer">
          <input class="checkbox m-1" type="checkbox" onClick={() => setIsDirectoryDisabled(!isDirectoryDisabled())} />

          <span class="label-text m-1">Disable "Save in Folder"<br />and enable "Save as"</span>
        </label>
      </div>
    </div>
  )
}

export default DownloadFolders