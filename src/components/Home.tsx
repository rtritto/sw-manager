import { Show, type JSX } from 'solid-js'
import { Provider, useAtom, useAtomValue } from 'solid-jotai'
import { useHydrateAtoms } from 'solid-jotai/utils'

import { directoryAtom, messageAtom, showNotificationAtom, showRestartButtonAtom } from '../store/atoms'
import { CHANNELS } from '../constants'
import UpdatesManager from './UpdatesManager'

type InitialValues = Parameters<typeof useHydrateAtoms>[0]

const HydrateAtoms = ({ initialValues, children }: { initialValues: InitialValues, children: JSX.Element }): JSX.Element => {
  // initialising on state with prop on render here
  useHydrateAtoms(initialValues)
  return children
}

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

      <Provider>
        <HydrateAtoms initialValues={[[directoryAtom, window.electronApi.downloadsFolder]]}>
          <UpdatesManager />
        </HydrateAtoms>
      </Provider>
    </div>
  )
}

export default Home