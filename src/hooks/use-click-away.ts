/* ┐
   │ File: use-click-away.ts [/src/hooks/use-click-away.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: May 7th, 2023 - 21:08:49
   │ Modified: May 8th, 2023 - 10:58:19
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

/**
 * Hook that alerts clicks outside of the passed ref
 * @param {React.MutableRefObject<HTMLElement | null>} ref The ref to the element to watch.
 * @param {(event: MouseEvent | TouchEvent) => void} onClickAway The callback to call when the click away event is triggered.
 * @returns {void}
 * @example
 * ```js
 * const ref = useRef(null)
 * useClickAway(ref, () => console.log('Clicked away!'))
 * ```
 */
export default function useClickAway(
    ref: React.MutableRefObject<HTMLElement | null>,
    onClickAway: (event: MouseEvent | TouchEvent) => void,
) {
    React.useEffect(() => {
        const handleClickAway = (event: MouseEvent | TouchEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClickAway(event)
            }
        }

        document.addEventListener('mousedown', handleClickAway)
        document.addEventListener('touchstart', handleClickAway)
        return () => {
            document.removeEventListener('mousedown', handleClickAway)
            document.removeEventListener('touchstart', handleClickAway)
        }
    }, [ref, onClickAway])
}
