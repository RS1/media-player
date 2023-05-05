/* ┐
   │ File: math.ts [/src/utils/math.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 27th, 2023 - 12:10:24
   │ Modified: May 2nd, 2023 - 13:05:57
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */

/**
 * Clamp a value between a min and max value
 * @param {number} value the value to clamp
 * @param {number} min the minimum value
 * @param {number} max the maximum value
 * @returns {number} the clamped value
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}

/**
 * Shuffle an array using the Fisher-Yates algorithm.
 * @param {T[]} array the array to shuffle
 * @returns {T[]} the shuffled array
 * @see https://stackoverflow.com/a/12646864
 */
export function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
}
