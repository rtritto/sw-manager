import { Show } from 'solid-js'
import { useAtom, useAtomValue } from 'solid-jotai'
import { messageAtom, showNotificationAtom, showRestartButtonAtom } from '../store/atoms'
import { CHANNELS } from '../constants'
import UpdatesManager from './UpdatesManager'

const Home: Component = () => {
  const [showNotification, setShowNotification] = useAtom(showNotificationAtom)
  const showRestartButton = useAtomValue(showRestartButtonAtom)
  const message = useAtomValue(messageAtom)

  const closeNotification = () => {
    setShowNotification(true)
  }

  const restartApp = () => {
    window.electronApi.ipcRenderer.send(CHANNELS.RESTART_APP)
  }

  return (
    <div>
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

      <UpdatesManager />
    </div>
  )
}

export default Home