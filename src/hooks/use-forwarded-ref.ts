/* ┐
   │ File: use-forwarded-ref.ts [/src/hooks/use-forwarded-ref.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 25th, 2023 - 12:57:21
   │ Modified: April 27th, 2023 - 12:22:32
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { ForwardedRef, MutableRefObject, useRef } from 'react'

/**
 * A hook that gives access to a ref while also forwarding it to a parent component.
 * @param {ForwardedRef<T>} forwardedRef The ref to forward.
 * @returns {[MutableRefObject<T | null>, (node: T | null) => void]} A tuple containing the ref and a function to set it.
 * @example const [ref, setRef] = useForwardedRef(forwardedRef)
 *          return <div ref={setRef} />
 */
function useForwardedRef<T>(forwardedRef: ForwardedRef<T>): [MutableRefObject<T | null>, (node: T | null) => void] {
    const ref = useRef<T | null>(null)
    const setRef = (node: T | null) => {
        if (typeof forwardedRef === 'function') forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
        ref.current = node
    }
    return [ref, setRef]
}

export default useForwardedRef
