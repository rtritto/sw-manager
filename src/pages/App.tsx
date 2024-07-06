import type { Component } from 'solid-js'
import Home from '../components/Home'


const App: Component = () => {
  return (
    <div>
      <h1>Solid + Vite + TypeScript</h1>

      <p class="read-the-docs">
        Click on the Solid, Vite and TypeScript logos to learn more
      </p>

      <Home />
    </div>
  )
}

export default App