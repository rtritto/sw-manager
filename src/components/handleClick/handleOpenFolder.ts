const handleOpenFolder = async (folderPath: string | string[]) => {
  await window.electronApi.openFolder(folderPath)
}

export default handleOpenFolder