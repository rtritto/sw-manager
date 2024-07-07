import { Show, createEffect, createSignal, type Component } from 'solid-js'
import { useAtom, useAtomValue } from 'solid-jotai'
import { messageAtom, showNotificationAtom, showRestartButtonAtom } from '../store/atoms'
import { CHANNELS } from '../constants'
import TableSelectionRows from '../components/TableSelectionRows'

const Home: Component = () => {
  const [showNotification, setShowNotification] = useAtom(showNotificationAtom)
  const showRestartButton = useAtomValue(showRestartButtonAtom)
  const message = useAtomValue(messageAtom)

  const [infos, setInfos] = createSignal<Info[]>()

  const closeNotification = () => {
    setShowNotification(true)
  }

  const restartApp = () => {
    window.electronApi.ipcRenderer.send(CHANNELS.RESTART_APP)
  }

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
      window.electronApi.ipcRenderer.removeAllListeners(CHANNELS.RESTART_APP)
    }
  }, [])

  return (
    <div>
      <button class="btn" onClick={checkForUpdate}>Check For Update</button>

      <Show when={showNotification() === true}>
        <div id="notification">
          <p id="message">{message()}</p>

          <button id="close-button" class="btn" onClick={closeNotification}>
            Close
          </button>

          <Show when={showRestartButton() === true}>
            <button id="restart-button" class="btn" onClick={restartApp}>
              Restart
            </button>
          </Show>
        </div>
      </Show>

      <TableSelectionRows infos={infos()} />
    </div>
  )
}

export default Home