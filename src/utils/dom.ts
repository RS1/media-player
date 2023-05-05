/* ┐
   │ File: dom.ts [/src/utils/dom.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 27th, 2023 - 12:11:21
   │ Modified: April 27th, 2023 - 12:22:32
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */

/**
 * Determine whether an element has auto height/width
 * @param {HTMLElement | null} element the element to check
 * @param {'height' | 'width'} property the property to check (height or width)
 * @returns {boolean} whether the element has auto height/width
 * @see https://stackoverflow.com/a/30741221
 */
function elementHasAutoProperty(element: HTMLElement | null, property: 'height' | 'width'): boolean {
    if (!element) return false
    // Clone node to avoid affecting the original element
    const clone = element.cloneNode(true) as HTMLElement
    clone.removeAttribute('id')
    clone.style.visibility = 'hidden'
    clone.style.opacity = '0'
    // Insert the clone after the original element
    element.after(clone)
    // Get the property of the clone with and without content
    const initial = property === 'height' ? clone.offsetHeight : clone.offsetWidth
    clone.innerHTML = ''
    const current = property === 'height' ? clone.offsetHeight : clone.offsetWidth
    // Clean up
    clone.remove()
    // The element has auto property if the property without content is less than the property with content
    return current < initial
}

/**
 * Determine whether an element has auto height
 * @param {HTMLElement | null} element the element to check
 * @returns {boolean} whether the element has auto height
 * @see https://stackoverflow.com/a/30741221
 */
export function elementHasAutoHeight(element: HTMLElement | null): boolean {
    return elementHasAutoProperty(element, 'height')
}

/**
 * Determine whether an element has auto width
 * @param {HTMLElement | null} element the element to check
 * @returns {boolean} whether the element has auto width
 * @see https://stackoverflow.com/a/30741221
 */
export function elementHasAutoWidth(element: HTMLElement | null): boolean {
    return elementHasAutoProperty(element, 'width')
}
