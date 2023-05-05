/* ┐
   │ File: .eslintrc.js [/.eslintrc.js]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 19th, 2023 - 10:02:31
   │ Modified: May 4th, 2023 - 16:16:59
   │
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */

module.exports = {
    env: {
        browser: true,
        node: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    overrides: [],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
    rules: {
        'react/react-in-jsx-scope': 'off',
        'no-trailing-spaces': ['error', { ignoreComments: true }],
        '@typescript-eslint/no-var-requires': 'off',
        quotes: [
            'error',
            'single',
            {
                avoidEscape: true,
                allowTemplateLiterals: true,
            },
        ],
        semi: ['error', 'never'],
        '@typescript-eslint/quotes': [
            'error',
            'single',
            {
                avoidEscape: true,
                allowTemplateLiterals: true,
            },
        ],
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
    },
    ignorePatterns: ['dist/**/*', 'node_modules/**/*', 'src/assets/**/*'],
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
}
