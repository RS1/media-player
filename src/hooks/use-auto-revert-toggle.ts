/* ┐
   │ File: use-auto-revert-toggle.ts [/src/hooks/use-auto-revert-toggle.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 26th, 2023 - 14:35:04
   │ Modified: April 27th, 2023 - 12:22:32
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useState, useCallback, useRef } from 'react'

import { debounce } from '@utils/fn'

function useAutoRevertToggle<T>(): readonly [T | boolean, (v?: T) => void]
function useAutoRevertToggle<T>(initialValue: T | boolean): readonly [T | boolean, (v?: T) => void]
function useAutoRevertToggle<T>(timeout: number): readonly [T | boolean, (v?: T) => void]
function useAutoRevertToggle<T>(
    valueOrTimeout?: T | boolean | number,
    timeout?: number,
): readonly [T | boolean, (v?: T) => void] {
    let _initialValue: T | boolean
    let _timeout: number
    if (typeof valueOrTimeout === 'number') {
        _initialValue = false
        _timeout = valueOrTimeout
    } else if (typeof valueOrTimeout === 'undefined') {
        _initialValue = false
        _timeout = 300
    } else {
        _initialValue = valueOrTimeout
        _timeout = timeout ?? 300
    }

    const timer = useRef<number | undefined>(undefined)
    const [value, setValue] = useState<T | boolean>(_initialValue)

    const toggle = useCallback(
        debounce((v?: T) => {
            setValue(v ?? !_initialValue)
            clearTimeout(timer.current)
            timer.current = window.setTimeout(() => {
                setValue(_initialValue)
                timer.current = undefined
            }, _timeout)
        }, _timeout),
        [_timeout, _initialValue],
    )

    return [value, toggle] as const
}

export default useAutoRevertToggle
