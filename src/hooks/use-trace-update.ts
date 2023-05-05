/* ┐
   │ File: use-trace-update.ts [/src/hooks/use-trace-update.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 27th, 2023 - 13:56:03
   │ Modified: April 27th, 2023 - 13:57:19
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useRef, useEffect } from 'react'

type Props = {
    [key: string]: unknown
}

export default function useTraceUpdate(props: { [key: string]: unknown }) {
    const prev = useRef(props)
    useEffect(() => {
        const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
            if (prev.current[k] !== v) {
                ps[k] = [prev.current[k], v]
            }
            return ps
        }, {} as Props)
        if (Object.keys(changedProps).length > 0) {
            console.log('Changed props:', changedProps)
        }
        prev.current = props
    })
}
