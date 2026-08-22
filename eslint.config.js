import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import tailwind from 'eslint-plugin-tailwindcss'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // d.ts files are pure type declarations — no point linting them
  globalIgnores(['dist', '**/*.d.ts']),
  tailwind.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      tailwindcss: {
        config: 'src/style.css',
        callees: ['cn'],
        whitelist: [
          'safe-bottom',
          'custom-scrollbar',
          'animate-popup',
          'animate-zoom-in',
          'animate-in',
          'fade-in',
          'zoom-in-95',
          'slide-in-from-top-2',
        ],
      },
    },
    rules: {
      'tailwindcss/no-custom-classname': ['warn', {
        whitelist: [
          'safe-bottom',
          'custom-scrollbar',
          'animate-popup',
          'animate-zoom-in',
          'animate-in',
          'fade-in',
          'zoom-in-95',
          'slide-in-from-top-2',
        ],
      }],
      // Allow intentionally unused variables when prefixed with _
      '@typescript-eslint/no-unused-vars': ['error', {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
    },
  },
  {
    files: ['src/utils/cn.ts'],
    rules: {
      'tailwindcss/no-custom-classname': 'off',
    },
  },
])


