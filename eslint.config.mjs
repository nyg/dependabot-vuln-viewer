import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import stylistic from '@stylistic/eslint-plugin'

const eslintConfig = defineConfig([
   ...nextVitals,
   {
      plugins: { '@stylistic': stylistic },
      rules: {
         '@stylistic/indent': ['error', 3, { SwitchCase: 1 }],
         '@stylistic/semi': ['error', 'never'],
         'react-hooks/exhaustive-deps': 'off',
         '@stylistic/quotes': ['error', 'single'],
         curly: ['error', 'all'],
         '@stylistic/brace-style': ['error', '1tbs'],
         '@stylistic/no-trailing-spaces': 'error',
         'sort-imports': ['error', { ignoreCase: true, allowSeparatedGroups: true }],
      }
   },
   globalIgnores([
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
   ]),
])

export default eslintConfig
