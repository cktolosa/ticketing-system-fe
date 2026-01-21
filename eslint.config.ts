import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },

  tseslint.configs.recommended,

  pluginVue.configs['flat/recommended'],

  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  prettier,

  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
]);
