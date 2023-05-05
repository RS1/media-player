/* ┐
   │ File: use-partial-state-reducer.ts [/src/media/hooks/use-partial-state-reducer.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 14:40:45
   │ Modified: April 28th, 2023 - 15:50:43
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useCallback, useState } from 'react'

export type PartialStateReducer<S> = (value: Partial<S> | ((prevState: S) => Partial<S>)) => void

export function usePartialStateReducer<S extends Record<string & keyof S, unknown>>(initialState: S | (() => S)) {
    const [state, _setState] = useState(initialState)
    const updateState = useCallback((newState: Partial<S> | ((s: S) => Partial<S>)) => {
        _setState(s => {
            const _s = typeof newState === 'function' ? newState(s) : newState

            // Keep only keys that are present in the initial state
            const _sKeys = Object.keys(_s)
            const _sKeysFiltered = _sKeys.filter(k => Object.keys(s).includes(k)) as (keyof S)[]
            const _sFiltered = _sKeysFiltered.reduce((acc, k) => {
                acc[k] = _s[k]
                return acc
            }, {} as Partial<S>)

            const made = {
                ...s,
                ..._sFiltered,
            }
            return JSON.stringify(made) === JSON.stringify(s) ? s : made
        })
    }, [])

    return [state, updateState] as const
}
