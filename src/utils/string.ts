/* ┐
   │ File: string.ts [/src/utils/string.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 27th, 2023 - 12:10:24
   │ Modified: May 9th, 2023 - 9:31:11
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */

/**
 * Add a leading zero to a number if it's less than 10
 * @param {number} value the value to pad
 * @returns {string} the padded value
 */
export function padZero(value: number): string {
    return `${value < 10 ? '0' : ''}${value}`
}

/**
 * Capitalize the first letter of a string
 * @param {string} str the string to capitalize
 * @returns {string} the capitalized string
 */
export function capitalize(str: string): string {
    if (typeof str !== 'string') return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Convert a time in seconds to a string in the format HH:MM:SS,
 * or MM:SS if the time is less than an hour.
 * @param {number} seconds the time in seconds
 * @param {boolean} roundTop whether to round the seconds up or down
 * @returns {string} the time in the format HH:MM:SS
 * @example timeToString(60.5) // '1:00'
 * @example timeToString(-60.5) // '-1:00'
 * @example timeToString(60.5, true) // '1:01'
 * @example timeToString(3600) // '1:00:00'
 */
export function timeToString(seconds: number, roundTop = false): string {
    const prefix = seconds < 0 ? '-' : ''
    const absSeconds = Math[roundTop ? 'ceil' : 'floor'](Math.abs(seconds))

    const hh = Math.floor(absSeconds / 3600)
    const ii = Math.floor((absSeconds % 3600) / 60)
    const ss = absSeconds % 60

    return `${prefix}${hh > 0 ? `${hh}:${padZero(ii)}` : ii}:${padZero(ss)}`
}

/**
 * Transform a string from camelCase to kebab-case
 * @param str the string to transform
 * @returns the transformed string
 * @example camelToKebabCase('fooBar10') // 'foo-bar-10'
 */
export function camelToKebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/([0-9])([a-zA-Z])/g, '$1-$2')
        .toLowerCase()
}
