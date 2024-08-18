import { useAtom } from 'solid-jotai'
import type { Component } from 'solid-js'

import { isUpdateConfigEnabledAtom } from '../store/atoms'

const UpdateConfig: Component<{
  class?: string
}> = (props) => {
  const [isUpdateConfigEnabled, setIsUpdateConfigEnabled] = useAtom(isUpdateConfigEnabledAtom)

  return (
    <div class={`form-control${props.class ? ` ${props.class}` : ''}`}>
      <label class="label cursor-pointer p-0">
        <span class="label-text">Update <b>Config</b> <i>File</i></span>

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