import { For } from 'solid-js'

const SelectCategories = (props) => {
  return (
    <div class="join">
      <For each={props.categories}>
        {(category) => (
          <div class="form-control join-item">
            <label class="label cursor-pointer">
              <span class="label-text">{category}</span>

              <input
                type="checkbox"
                class="checkbox m-1"
                checked={props.categoriesChecked[category] === true}
                onClick={() => props.setCategoriesChecked(category as Category, !props.categoriesChecked[category])}
              />
            </label>
          </div>
        )}
      </For>
    </div>
  )
}

export default SelectCategories