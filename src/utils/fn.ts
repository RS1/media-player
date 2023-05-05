/* ┐
   │ File: fn.ts [/src/utils/fn.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 27th, 2023 - 12:09:30
   │ Modified: April 27th, 2023 - 12:22:32
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */

/**
 * Throttle `callback` to be called only once every `delay` milliseconds
 * @param {(...args: T) => void} callback the callback to throttle
 * @param {number} [delay=250] the delay in milliseconds
 * @returns {(...args: T) => void} a throttled version of `callback` that can be called only once every `delay` milliseconds
 */
export function throttle<T extends unknown[]>(callback: (...args: T) => void, delay = 250): (...args: T) => void {
    let shouldWait = false

    return function (...args) {
        if (shouldWait) return
        shouldWait = true
        setTimeout(() => {
            shouldWait = false
        }, delay)
        return callback(...args)
    }
}

/**
 * Debounce `callback` to be called only after `delay` milliseconds have passed since the last call
 * @param {(...args: T) => void} callback the callback to debounce
 * @param {number} [delay=250] the delay in milliseconds
 * @returns {(...args: T) => void} a debounced version of `callback` that can be called only after `delay` milliseconds have passed since the last call
 */
export function debounce<T extends unknown[]>(callback: (...args: T) => void, delay = 250): (...args: T) => void {
    let timeout: number | undefined = undefined

    return function (...args) {
        clearTimeout(timeout)
        timeout = window.setTimeout(() => {
            callback(...args)
        }, delay)
    }
}
