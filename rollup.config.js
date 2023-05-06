/* ┐
   │ File: rollup.config.js [/rollup.config.js]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: January 6th, 2021 - 12:29:37
   │ Modified: May 6th, 2023 - 15:02:35
   │
   │ Copyright (c) 2021 - 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import path from 'path'
import postcss from 'rollup-plugin-postcss'
import { string } from 'rollup-plugin-string'
import { terser } from 'rollup-plugin-terser'
import ts from 'rollup-plugin-ts'
import tailwindcss from 'tailwindcss'

import pkg from './package.json'

// @ts-ignore
const twConfig = require('./tailwind.js')

const aliases = {
    '@assets': 'src/assets',
    '@css': 'src/assets/css',
    '@icons': 'src/assets/icons',
    '@bits': 'src/bits',
    '@media': 'src/media',
    '@utils': 'src/utils',
    '@hooks': 'src/hooks',
    '@': 'src',
}

export default {
    input: 'src/index.ts',
    context: 'window',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: process.env.NODE_ENV !== 'production',
            strict: false,
        },
        {
            file: pkg.module,
            format: 'es',
            exports: 'named',
            sourcemap: process.env.NODE_ENV !== 'production',
            strict: false,
        },
    ],
    watch: {
        include: ['src/**', 'tsconfig.json', 'tailwind.js', 'rollup.config.js', 'node_modules/**'],
    },
    plugins: [
        alias({
            entries: Object.fromEntries(Object.entries(aliases).map(([k, v]) => [k, path.resolve(__dirname, v)])),
        }),
        nodeResolve({ extensions: ['.jsx', '.js', '.ts', '.tsx'] }),
        string({
            include: '**/*.svg',
            exclude: 'node_modules/**',
        }),
        postcss({
            extensions: ['.css'],
            minimize: true,
            inject: {
                insertAt: 'top',
            },
            // extract: 'index.css',
            plugins: [
                tailwindcss(twConfig),
                require('autoprefixer'),
                require('postcss-import'),
                require('cssnano')({
                    preset: ['default', { discardComments: { removeAll: true } }],
                }),
            ],
        }),
        commonjs({
            exclude: ['dist/**', 'src/assets/**'],
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            exclude: 'node_modules/**',
        }),
        ts({
            tsconfig: './tsconfig.json',
            declaration: true,
            exclude: 'node_modules/**',
            external: ['react', 'react-dom'],
            transpiler: 'babel',
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            babelConfig: {
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            targets: '> 0.5%, last 2 versions, Firefox ESR, not dead',
                            useBuiltIns: 'usage',
                            corejs: 3,
                        },
                    ],
                    '@babel/preset-typescript',
                    '@babel/preset-react',
                ],
                plugins: [
                    '@babel/plugin-transform-runtime',
                    [
                        'module-resolver',
                        {
                            root: ['./src'],
                            alias: Object.fromEntries(Object.entries(aliases).map(([k, v]) => [k, `./${v}`])),
                        },
                    ],
                    '@babel/plugin-proposal-nullish-coalescing-operator',
                    '@babel/plugin-proposal-optional-chaining',
                ],
            },
        }),
        process.env.NODE_ENV === 'production' && terser(),
    ],
    external: [...Object.keys(pkg.peerDependencies ?? {}), ...Object.keys(pkg.dependencies ?? {})],
}
