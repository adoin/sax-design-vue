import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from './vite.config.ts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      clearMocks: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
    },
  }),
)
