import { type Config } from 'prettier';

const config: Config = {
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  trailingComma: 'es5',

  importOrder: [
    '<BUILTIN_MODULES>',
    '<THIRD_PARTY_MODULES>',
    '^@/components/(.*)$',
    '^@/lib/(.*)$',
    '^@/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,

  vueIndentScriptAndStyle: false,
  singleAttributePerLine: false,

  htmlWhitespaceSensitivity: 'css',
  bracketSameLine: false,
  endOfLine: 'lf',

  overrides: [
    {
      files: '*.vue',
      options: {
        parser: 'vue',
      },
    },
  ],
};

export default config;
