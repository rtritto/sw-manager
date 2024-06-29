import type { Config } from 'tailwindcss'
import twElementPlugin from 'tw-elements/plugin.cjs'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    // './node_modules/tw-elements/js/**/*.js'
  ],
  theme: {
    extend: {}
  },
  darkMode: 'class',
  plugins: [twElementPlugin]
} as Config