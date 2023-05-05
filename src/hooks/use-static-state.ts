/* ┐
   │ File: use-static-state.ts [/src/hooks/use-static-state.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 27th, 2023 - 11:13:58
   │ Modified: April 27th, 2023 - 12:22:32
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React, { useRef, useCallback } from 'react'

/**
 * Returns a state that does not cause re-renders when updated.
 * @param {T | (() => T)} initializer The initializer function or value.
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]} The state and the setter function.
 */
function useStaticState<T>(constant: T): readonly [T, React.Dispatch<React.SetStateAction<T>>]
function useStaticState<T>(initializer: () => T): readonly [T, React.Dispatch<React.SetStateAction<T>>]
function useStaticState<T>(initializer: T | (() => T)): readonly [T, React.Dispatch<React.SetStateAction<T>>] {
    const state = useRef<T>(typeof initializer === 'function' ? (initializer as () => T)() : initializer)

    const setState = useCallback((newState: React.SetStateAction<T>) => {
        if (typeof newState === 'function') {
            state.current = (newState as (prevState: T) => T)(state.current)
        } else {
            state.current = newState
        }
    }, [])

    return [state.current, setState] as const
}

export default useStaticState
