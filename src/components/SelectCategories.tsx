import { useAtom } from 'solid-jotai'
import { type Component, For } from 'solid-js'

import { ALL_CATEGORIES } from '../constants'
import { categoriesCheckedAtom } from '../store/atoms'
import { categoriesCheckedStore } from '../store/stores'

const SelectCategories: Component = () => {
  const [categoriesChecked, setCategoriesChecked] = useAtom(categoriesCheckedAtom, { store: categoriesCheckedStore })

  return (
    <div class="join">
      <For each={ALL_CATEGORIES}>
        {(category) => (
          <div class="form-control join-item">
            <label class="label cursor-pointer">
              <span class="label-text">{category}</span>

              <input
                type="checkbox"
                class="checkbox m-1"
                checked={categoriesChecked()[category as Category] === true}
                onClick={() => setCategoriesChecked({
                  ...categoriesChecked(),
                  [category as Category]: !categoriesChecked()[category as Category]
                })}
              />
            </label>
          </div>
        )}
      </For>
    </div>
  )
}

export default SelectCategories