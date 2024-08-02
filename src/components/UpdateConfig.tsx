import { useAtom } from 'solid-jotai'
import type { Component } from 'solid-js'

import { isUpdateConfigEnabledAtom } from '../store/atoms'

const UpdateConfig: Component<{
  class: string | undefined
}> = (props) => {
  const [isUpdateConfigEnabled, setIsUpdateConfigEnabled] = useAtom(isUpdateConfigEnabledAtom)

  return (
    <div class={`form-control join-item${props.class ? ' ' + props.class : ''}`}>
      <label class="label cursor-pointer">
        <span class="label-text">Update "Config" file</span>

        <input
          type="checkbox"
          class="checkbox m-1"
          checked={isUpdateConfigEnabled() === true}
          onClick={() => setIsUpdateConfigEnabled(!isUpdateConfigEnabled())}
        />
      </label>
    </div>
  )
}

export default UpdateConfig