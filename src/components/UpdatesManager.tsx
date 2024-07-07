import { createEffect, type Component } from 'solid-js'
import { useAtom } from 'solid-jotai'
import { infosAtom } from '../store/atoms'
import { CHANNELS } from '../constants'
import TableSelectionRows from '../components/TableSelectionRows'

const UpdatesManager: Component = () => {
  const [infos, setInfos] = useAtom(infosAtom)

  const checkForUpdate = async () => {
    // window.electronApi.ipcRenderer.send(CHANNELS.CHECK_FOR_UPDATE)
    const _infos = await window.electronApi.checkForUpdate()
    setInfos(Object.values(_infos.results))
  }

  createEffect(() => {
    // Listen for the event
    // window.electronApi.ipcRenderer.on('', (event, arg) => {
    //   ...
    // })

    // Clean the listener after the component is dismounted
    return () => {
      window.electronApi.ipcRenderer.removeAllListeners(CHANNELS.CHECK_FOR_UPDATE)
    }
  }, [])

  return (
    <div>
      <button class="btn" onClick={checkForUpdate}>Check For Update</button>

      <TableSelectionRows infos={infos()} />
    </div>
  )
}

export default UpdatesManager