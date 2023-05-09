/* ┐
   │ File: tailwind.js [/tailwind.js]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 19th, 2023 - 11:09:49
   │ Modified: May 9th, 2023 - 13:53:02
   │
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */

/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ['./src/**/*.js', './src/**/*.ts', './src/**/*.tsx', './src/assets/*.css'],
    important: '#rmp-root',
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            vinyl: 'rgb(238, 238, 238)',
            'controls-color': 'var(--rmp-controls-color)',
            'metadata-color': 'var(--rmp-metadata-color)',
            'accent-color': 'var(--rmp-accent-color)',
            'error-color': 'var(--rmp-error-color)',
            'controls-bg': 'var(--rmp-controls-bg)',
            'metadata-bg': 'var(--rmp-metadata-bg)',
            'media-bg': 'var(--rmp-media-bg)',
        },
        fontFamily: {
            sans: ['var(--rmp-text-font)', 'sans-serif'],
            mono: ['var(--rmp-mono-font)', 'monospace'],
        },
        extend: {
            fontSize: {
                xxs: ['0.62rem', '0.75rem'],
            },
            aspectRatio: {
                '1/1': '1 / 1',
                '2/1': '2 / 1',
                '1/2': '1 / 2',
                '3/1': '3 / 1',
                '1/3': '1 / 3',
                '2/3': '2 / 3',
                '3/2': '3 / 2',
                '4/3': '4 / 3',
                '3/4': '3 / 4',
                '16/9': '16 / 9',
                '9/16': '9 / 16',
                '21/9': '21 / 9',
                '9/21': '9 / 21',
            },
        },
    },
    safelist: [
        'aspect-1/1',
        'aspect-2/1',
        'aspect-1/2',
        'aspect-3/1',
        'aspect-1/3',
        'aspect-2/3',
        'aspect-3/2',
        'aspect-4/3',
        'aspect-3/4',
        'aspect-16/9',
        'aspect-9/16',
        'aspect-21/9',
        'aspect-9/21',
        'w-1',
        'w-2',
        'w-3',
        'w-4',
        'w-5',
        'w-6',
        'w-7',
        'w-8',
        'w-9',
        'w-10',
        'h-1',
        'h-2',
        'h-3',
        'h-4',
        'h-5',
        'h-6',
        'h-7',
        'h-8',
        'h-9',
        'h-10',
    ],
    corePlugins: {
        container: false,
        preflight: false,
    },
    plugins: [],
}
