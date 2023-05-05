/* ┐
   │ File: use-double-tap.ts [/src/hooks/use-double-tap.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 26th, 2023 - 11:05:55
   │ Modified: April 27th, 2023 - 12:22:32
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useCallback, useEffect, useRef } from 'react'

/**
 * Hook to handle double tap events
 * @param {{ onDoubleTap: () => void, onSingleTap?: () => void, delay?: number }} options The options object containing the callbacks and the delay
 * @returns {() => void} A function that execute single or double tap callback depending on the delay between taps
 */
function useDoubleTap({
    onDoubleTap,
    onSingleTap,
    delay = 300,
}: {
    onDoubleTap: () => void
    onSingleTap?: () => void
    delay?: number
}) {
    const timeout = useRef<number | null>(null)

    const handleTap = useCallback(
        (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
            if (e.detail > 1) {
                timeout.current && clearTimeout(timeout.current)
                timeout.current = null
                onDoubleTap()
            } else {
                timeout.current = window.setTimeout(() => {
                    timeout.current = null
                    onSingleTap?.()
                }, delay)
            }
        },
        [onDoubleTap, onSingleTap, delay],
    )

    useEffect(() => {
        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current)
                timeout.current = null
            }
        }
    }, [])

    return handleTap
}

export default useDoubleTap
