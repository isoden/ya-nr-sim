import { fileURLToPath } from 'node:url'
import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import { includeIgnoreFile } from '@eslint/compat'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import eslintReact from '@eslint-react/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import stylistic from '@stylistic/eslint-plugin'

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

export default defineConfig([
  includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
  stylistic.configs.customize({
    arrowParens: true,
    braceStyle: '1tbs',
  }),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js, '@stylistic': stylistic },
    extends: ['js/recommended'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      '@stylistic/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'none',
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      }],
    },
  },
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [eslintReact.configs['recommended-typescript']],
  },
  reactHooks.configs.flat['recommended-latest'],
  {
    files: ['**/*.{jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'better-tailwindcss': betterTailwindcss,
    },
    rules: {
      ...betterTailwindcss.configs['recommended-error'].rules,
      'better-tailwindcss/no-unknown-classes': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/app.css',
      },
    },
  },
])
