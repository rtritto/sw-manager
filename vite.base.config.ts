import { builtinModules } from 'node:module'
import type { AddressInfo } from 'node:net'
import type { ConfigEnv, Plugin, UserConfig } from 'vite'
import pkg from './package.json'

export const builtins = ['electron', ...builtinModules.flatMap((m) => [m, `node:${m}`])]

export const external = [...builtins, ...Object.keys('dependencies' in pkg ? (pkg.dependencies as Record<string, unknown>) : {})]

export function getBuildConfig({ root, mode, command }: ConfigEnv<'build'>): UserConfig {
  return {
    root,
    mode,
    build: {
      // Prevent multiple builds from interfering with each other.
      emptyOutDir: false,
      // 🚧 Multiple builds may conflict.
      outDir: '.vite/build',
      watch: command === 'serve' ? {} : null,
      minify: command === 'build'
    },
    cacheDir: '.vite/cache',
    clearScreen: false
  }
}

export function getDefineKeys(names: string[]) {
  const define: { [name: string]: VitePluginRuntimeKeys } = {}

  for (const name of names) {
    const NAME = name.toUpperCase()
    define[name] = {
      VITE_DEV_SERVER_URL: `${NAME}_VITE_DEV_SERVER_URL`,
      VITE_NAME: `${NAME}_VITE_NAME`
    }
  }

  return define
}

export function getBuildDefine(env: ConfigEnv<'build'>) {
  const { command, forgeConfig } = env
  const names = forgeConfig.renderer.filter(({ name }) => name != null).map(({ name }) => name!)
  const defineKeys = getDefineKeys(names)
  const define: Record<string, string | undefined> = {}

  for (const name in defineKeys) {
    const { VITE_DEV_SERVER_URL, VITE_NAME } = defineKeys[name]
    define[VITE_DEV_SERVER_URL] = command === 'serve' ? JSON.stringify(process.env[VITE_DEV_SERVER_URL]) : undefined
    define[VITE_NAME] = JSON.stringify(name)
  }

  return define
}

export function pluginExposeRenderer(name: string): Plugin {
  const { VITE_DEV_SERVER_URL } = getDefineKeys([name])[name]

  return {
    name: '@electron-forge/plugin-vite:expose-renderer',
    configureServer(server) {
      process.viteDevServers ??= {}
      // Expose server for preload scripts hot reload.
      process.viteDevServers[name] = server

      server.httpServer?.once('listening', () => {
        const addressInfo = server.httpServer!.address() as AddressInfo
        // Expose env constant for main process use.
        process.env[VITE_DEV_SERVER_URL] = `http://localhost:${addressInfo?.port}`
      })
    }
  }
}

export function pluginHotRestart(command: 'reload' | 'restart'): Plugin {
  return {
    name: '@electron-forge/plugin-vite:hot-restart',
    closeBundle() {
      if (command === 'reload') {
        for (const server of Object.values(process.viteDevServers)) {
          // Preload scripts hot reload.
          server.ws.send({ type: 'full-reload' })
        }
      } else {
        // Main process hot restart.
        // https://github.com/electron/forge/blob/v7.2.0/packages/api/core/src/api/start.ts#L216-L223
        process.stdin.emit('data', 'rs')
      }
    }
  }
}