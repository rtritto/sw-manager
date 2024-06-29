import { Show, createEffect } from 'solid-js'
import { useAtom, useAtomValue } from 'solid-jotai'
import { messageAtom, showNotificationAtom, showRestartButtonAtom } from '../store/atoms'
import { CHANNELS } from '../constants'
import TableSelectionRows from '../components/TableSelectionRows'

const Home = () => {
  const [showNotification, setShowNotification] = useAtom(showNotificationAtom)
  const showRestartButton = useAtomValue(showRestartButtonAtom)
  const message = useAtomValue(messageAtom)

  const closeNotification = () => {
    setShowNotification(true)
  }

  const restartApp = () => {
    window.electron.ipcRenderer.send(CHANNELS.RESTART_APP)
  }

  const checkForUpdate = () => {
    window.electron.ipcRenderer.send(CHANNELS.CHECK_FOR_UPDATE)
  }

  createEffect(() => {
    // Listen for the event
    // window.electron.ipcRenderer.on('', (event, arg) => {
    //   ...
    // })

    // Clean the listener after the component is dismounted
    return () => {
      window.electron.ipcRenderer.removeAllListeners(CHANNELS.CHECK_FOR_UPDATE)
      window.electron.ipcRenderer.removeAllListeners(CHANNELS.RESTART_APP)
    }
  }, [])

  return (
    <div>
      <button onClick={checkForUpdate}>Check For Update</button>

      <Show when={showNotification() === true}>
        <div id="notification">
          <p id="message">{message()}</p>

          <button id="close-button" onClick={closeNotification}>
            Close
          </button>

          <Show when={showRestartButton() === true}>
            <button id="restart-button" onClick={restartApp}>
              Restart
            </button>
          </Show>
        </div>
      </Show>

      <TableSelectionRows />
    </div>
  )
}

export default Home