const handleOpenFolder = async (folderPath: string | string[]) => {
  await globalThis.electronApi.openFolder(folderPath)
}

export default handleOpenFolder