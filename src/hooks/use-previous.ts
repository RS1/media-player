/* ┐
   │ File: use-previous.ts [/src/hooks/use-previous.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 27th, 2023 - 11:19:36
   │ Modified: April 27th, 2023 - 12:22:32
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useEffect, useRef } from 'react'

/**
 * Returns the previous value of the given value.
 * @param {T} value The value to track.
 * @returns {T | undefined} The previous value.
 * @template T
 * @example const [value, setValue] = useState(0)
 *          const previousValue = usePrevious(value)
 *          useEffect(() => {
 *              console.log('value changed from', previousValue, 'to', value)
 *          }, [value])
 *          setValue(1) // logs: value changed from 0 to 1
 *          setValue(2) // logs: value changed from 1 to 2
 */
function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>()
    useEffect(() => {
        ref.current = value
    }, [value])
    return ref.current
}

export default usePrevious
