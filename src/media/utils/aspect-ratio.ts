/* ┐
   │ File: aspect-ratio.ts [/src/media/utils/aspect-ratio.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 25th, 2023 - 11:40:05
   │ Modified: April 27th, 2023 - 10:35:00
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */

export const aspectRatios = [
    '1:1',
    '2:1',
    '1:2',
    '3:1',
    '1:3',
    '2:3',
    '3:2',
    '4:3',
    '3:4',
    '16:9',
    '9:16',
    '21:9',
    '9:21',
] as const

export type AspectRatio = (typeof aspectRatios)[number] | 'auto' | 'stretch'

export const aspectRatioMap = aspectRatios.reduce((acc, ratio) => {
    const [w, h] = ratio.split(':')
    acc[ratio] = `${w}/${h}` as `${number}/${number}`
    return acc
}, {} as Record<AspectRatio, `${number}/${number}`>)

export function getAspectRatio(aspectRatio: AspectRatio): `${number}/${number}` {
    return aspectRatioMap[aspectRatio] || aspectRatioMap['16:9']
}

export function getPaddingForAspectRatio(aspectRatio: AspectRatio): `${number}%` {
    const ratio = getAspectRatio(aspectRatio)
    const [w, h] = ratio.split('/').map(Number)
    return `${(h / w) * 100}%`
}
