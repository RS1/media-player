/* ┐
   │ File: color.ts [/src/utils/color.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 21st, 2023 - 16:14:04
   │ Modified: April 27th, 2023 - 12:22:32
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */

export type RGBA = { r: number; g: number; b: number; a: number }
const baseRGBA: RGBA = { r: 0, g: 0, b: 0, a: 1 }

const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i
const hexRegex3 = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i
const rgbRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/i
const hslRegex = /^hsla?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%(?:,\s*([\d.]+))?\)$/i

/**
 * Converts a hex color string to an RGBA object.
 * It supports both 3, 4, 6 and 8 digit hex color strings.
 * @param {string} string The hex color string to convert.
 * @returns {RGBA} The RGBA object.
 * @example #FF0000 -> { r: 255, g: 0, b: 0, a: 1 }
 *          #FF000080 -> { r: 255, g: 0, b: 0, a: 0.5 }
 *          #F00 -> { r: 255, g: 0, b: 0, a: 1 }
 *          #F00A -> { r: 255, g: 0, b: 0, a: 0.67 }
 */
export function hexStringToRGBA(string: string, fallback: string | RGBA = baseRGBA): string | RGBA {
    const match = string.match(hexRegex) || string.match(hexRegex3)

    if (!match) return fallback

    const r = parseInt(match[1], 16)
    const g = parseInt(match[2], 16)
    const b = parseInt(match[3], 16)
    const a = match[4] !== undefined ? parseInt(match[4], 16) / 255 : 1

    return { r, g, b, a }
}

/**
 * Converts an RGB color string to an RGBA object.
 * It supports both RGB and RGBA color strings.
 * @param {string} string The RGB color string to convert.
 * @returns {RGBA} The RGBA object.
 * @example rgb(255, 0, 0) -> { r: 255, g: 0, b: 0, a: 1 }
 *          rgba(255, 0, 0, 0.5) -> { r: 255, g: 0, b: 0, a: 0.5 }
 */
export function rgbStringToRGBA(string: string, fallback: string | RGBA = baseRGBA): string | RGBA {
    const match = string.match(rgbRegex)

    if (!match) return fallback

    const r = parseInt(match[1], 10)
    const g = parseInt(match[2], 10)
    const b = parseInt(match[3], 10)
    const a = match[4] !== undefined ? parseFloat(match[4]) : 1

    return { r, g, b, a }
}

/**
 * Converts an HSL color string to an RGBA object.
 * It supports both HSL and HSLA color strings.
 * @param {string} string The HSL color string to convert.
 * @returns {RGBA} The RGBA object.
 * @example hsl(0, 100%, 50%) -> { r: 255, g: 0, b: 0, a: 1 }
 *          hsla(0, 100%, 50%, 0.5) -> { r: 255, g: 0, b: 0, a: 0.5 }
 */
export function hslStringToRGB(string: string, fallback: string | RGBA = baseRGBA): string | RGBA {
    const match = string.match(hslRegex)

    if (!match) return fallback

    const h = parseInt(match[1], 10) / 360
    const s = parseInt(match[2], 10) / 100
    const l = parseInt(match[3], 10) / 100
    const a = match[4] !== undefined ? parseFloat(match[4]) : 1

    const calculateChannel = (c: number) => {
        const k = (c + h * 6) % 6
        return Math.round(255 * (l - l * s * Math.max(Math.min(k, 4 - k, 1), 0)))
    }

    const r = calculateChannel(5)
    const g = calculateChannel(3)
    const b = calculateChannel(1)

    return { r, g, b, a }
}

/**
 * Converts a color string to an RGBA object.
 * It supports hex, hexa, rgb, rgba, hsl and hsla color strings.
 * @param {string} color The color string to convert.
 * @param {string} fallback The fallback color string to use if the color string is invalid.
 * @returns {RGBA} The RGBA object.
 * @example #FF0000 -> { r: 255, g: 0, b: 0, a: 1 }
 *          #FF000080 -> { r: 255, g: 0, b: 0, a: 0.5 }
 *          #F00 -> { r: 255, g: 0, b: 0, a: 1 }
 *          #F00A -> { r: 255, g: 0, b: 0, a: 0.67 }
 *          rgb(255, 0, 0) -> { r: 255, g: 0, b: 0, a: 1 }
 *          rgba(255, 0, 0, 0.5) -> { r: 255, g: 0, b: 0, a: 0.5 }
 *          hsl(0, 100%, 50%) -> { r: 255, g: 0, b: 0, a: 1 }
 *          hsla(0, 100%, 50%, 0.5) -> { r: 255, g: 0, b: 0, a: 0.5 }
 */
export function colorStringToRGBA(color: string, fallback: string | RGBA = baseRGBA): string | RGBA {
    if (!color || color === 'transparent' || typeof color !== 'string') return fallback

    if (color.match(hexRegex) || color.match(hexRegex3)) return hexStringToRGBA(color)
    if (color.match(rgbRegex)) return rgbStringToRGBA(color)
    if (color.match(hslRegex)) return hslStringToRGB(color)

    return fallback
}
