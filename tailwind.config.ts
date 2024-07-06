import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  daisyui: {
    themes: [
      // 'light',
      'dark'
    ]
  },
  plugins: [daisyui]
} as Config