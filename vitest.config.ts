import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    include: ['src/tests/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['src/tests/e2e/**', 'node_modules/**', 'dist/**'],
  },
}))
