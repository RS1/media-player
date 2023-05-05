/* ┐
   │ File: use-constant.ts [/src/hooks/use-constant.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 27th, 2023 - 11:10:58
   │ Modified: April 27th, 2023 - 12:22:32
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useRef } from 'react'

/**
 * Returns a constant value that is initialized only once.
 * @param {T | (() => T)} initializer The initializer function or value.
 * @returns {T} The constant value.
 */
function useConstant<T>(constant: T): T
function useConstant<T>(initializer: () => T): T
function useConstant<T>(initializer: T | (() => T)): T {
    const ref = useRef<T>()
    if (!ref.current) {
        ref.current = typeof initializer === 'function' ? (initializer as () => T)() : initializer
    }
    return ref.current
}

export default useConstant
