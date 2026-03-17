import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
   ...nextVitals,
   {
      rules: {
         indent: ['error', 3, { SwitchCase: 1 }],
         semi: ['error', 'never'],
         'react-hooks/exhaustive-deps': 'off',
         quotes: ['error', 'single'],
         curly: ['error', 'all'],
         'brace-style': ['error', '1tbs'],
         'no-trailing-spaces': 'error',
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
