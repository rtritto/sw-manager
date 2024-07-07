import { For, type Component } from 'solid-js'

const TableSelectionRows: Component<{ infos: Info[] }> = (props) => {
  const onDownload = async (info: Info) => {
    // const downloadLink = await getDownloadLink(info)
    const downloadLink = await window.electronApi.singleDownload({ ...info })
    console.log('downloadLink: ', downloadLink);
    // console.log('info: ', info);
    // const a = await info.additionalInfo
    // console.log('a: ', a);
    // const { fileUrl } = a
    // console.log('url: ', fileUrl);
  }

  return (
    <div class="overflow-x-auto">
      <table class="table">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" class="checkbox" />
              </label>
            </th>
            <th>App</th>
            {/* <th>Name</th> */}
            <th>Current Version</th>
            <th>New Version</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {/* <tr>
            <th>
              <label>
                <input type="checkbox" class="checkbox" />
              </label>
            </th>
            <td>
              <div class="flex items-center gap-3">
                <div class="avatar">
                  <img
                    src="https://img.daisyui.com/tailwind-css-component-profile-2@56w.png"
                    alt="Avatar Tailwind CSS Component" />
                </div>
                <div>
                  <div class="font-bold">Hart Hagerty</div>
                  <div class="text-sm opacity-50">United States</div>
                </div>
              </div>
            </td>
            <td>
              Zemlak, Daniel and Leannon
              <br />
              <span class="badge badge-ghost badge-sm">Desktop Support Technician</span>
            </td>
            <td>Purple</td>
            <th>
              <button class="btn btn-ghost btn-xs">details</button>
            </th>
          </tr> */}
          <For each={props.infos}>
            {(item) => (
              <tr>
                <th>
                  <label>
                    <input type="checkbox" class="checkbox" />
                  </label>
                </th>
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <img
                        src={item.imageUrl}
                        alt="Avatar Tailwind CSS Component" />
                    </div>
                  </div>
                </td>
                <td>{item.currentVersion}</td>
                <td>{item.newVersion}</td>
                {/* <td>
                  Zemlak, Daniel and Leannon
                  <br />
                  <span class="badge badge-ghost badge-sm">Desktop Support Technician</span>
                </td> */}
                <th>
                  {/* <div class="tooltip" data-tip={item}> */}
                  <button class="btn" onClick={() => onDownload(item)}>Download</button>
                  {/* </div> */}
                </th>
              </tr>
            )}
          </For>
          {/* row 2 */}
        </tbody>
        {/* foot */}
        {/* <tfoot>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Job</th>
            <th>Favorite Color</th>
            <th></th>
          </tr>
        </tfoot> */}
      </table>
    </div>
  )
}


// {/* row 2 */}
// <tr>
//   <th>
//     <label>
//       <input type="checkbox" class="checkbox" />
//     </label>
//   </th>
//   <td>
//     <div class="flex items-center gap-3">
//       <div class="avatar">
//         <div class="mask mask-squircle h-12 w-12">
//           <img
//             src="https://img.daisyui.com/tailwind-css-component-profile-3@56w.png"
//             alt="Avatar Tailwind CSS Component" />
//         </div>
//       </div>
//       <div>
//         <div class="font-bold">Brice Swyre</div>
//         <div class="text-sm opacity-50">China</div>
//       </div>
//     </div>
//   </td>
//   <td>
//     Carroll Group
//     <br />
//     <span class="badge badge-ghost badge-sm">Tax Accountant</span>
//   </td>
//   <td>Red</td>
//   <th>
//     <button class="btn btn-ghost btn-xs">details</button>
//   </th>
// </tr>
// {/* row 3 */}
// <tr>
//   <th>
//     <label>
//       <input type="checkbox" class="checkbox" />
//     </label>
//   </th>
//   <td>
//     <div class="flex items-center gap-3">
//       <div class="avatar">
//         <div class="mask mask-squircle h-12 w-12">
//           <img
//             src="https://img.daisyui.com/tailwind-css-component-profile-4@56w.png"
//             alt="Avatar Tailwind CSS Component" />
//         </div>
//       </div>
//       <div>
//         <div class="font-bold">Marjy Ferencz</div>
//         <div class="text-sm opacity-50">Russia</div>
//       </div>
//     </div>
//   </td>
//   <td>
//     Rowe-Schoen
//     <br />
//     <span class="badge badge-ghost badge-sm">Office Assistant I</span>
//   </td>
//   <td>Crimson</td>
//   <th>
//     <button class="btn btn-ghost btn-xs">details</button>
//   </th>
// </tr>
// {/* row 4 */}
// <tr>
//   <th>
//     <label>
//       <input type="checkbox" class="checkbox" />
//     </label>
//   </th>
//   <td>
//     <div class="flex items-center gap-3">
//       <div class="avatar">
//         <div class="mask mask-squircle h-12 w-12">
//           <img
//             src="https://img.daisyui.com/tailwind-css-component-profile-5@56w.png"
//             alt="Avatar Tailwind CSS Component" />
//         </div>
//       </div>
//       <div>
//         <div class="font-bold">Yancy Tear</div>
//         <div class="text-sm opacity-50">Brazil</div>
//       </div>
//     </div>
//   </td>
//   <td>
//     Wyman-Ledner
//     <br />
//     <span class="badge badge-ghost badge-sm">Community Outreach Specialist</span>
//   </td>
//   <td>Indigo</td>
//   <th>
//     <button class="btn btn-ghost btn-xs">details</button>
//   </th>
// </tr>

export default TableSelectionRows