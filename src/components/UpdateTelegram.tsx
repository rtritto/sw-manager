import { useAtom } from 'solid-jotai'
import type { Component } from 'solid-js'

import { isUpdateTelegramEnabledAtom } from '../store/atoms'

const UpdateTelegram: Component<{
  class?: string
}> = (props) => {
  const [isUpdateTelegramEnabled, setIsUpdateTelegramEnabled] = useAtom(isUpdateTelegramEnabledAtom)

  return (
    <div class={`form-control${props.class ? ` ${props.class}` : ''}`}>
      <label class="label cursor-pointer p-0">
        <span class="label-text">Update <b>Telegram</b> <i>Channel</i></span>

        <input
          type="checkbox"
          class="checkbox m-1"
          checked={isUpdateTelegramEnabled() === true}
          onClick={() => setIsUpdateTelegramEnabled(!isUpdateTelegramEnabled())}
        />
      </label>
    </div>
  )
}

export default UpdateTelegram