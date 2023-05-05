/* ┐
   │ File: use-player-controls.ts [/src/media/hooks/use-player-controls.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: May 2nd, 2023 - 10:09:12
   │ Modified: May 5th, 2023 - 12:38:52
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useMemo } from 'react'

import { Breakpoint, useBreakpoint } from '@/hooks'

import { useMediaConfig } from './use-media-config'

/**
 * Use this hook anywhere within a `MediaProvider` to access the player controls currently in use.
 * @returns The current player controls.
 * @example
 * ```js
 * const playerControls = usePlayerControls()
 * ```
 */
export const usePlayerControls = () => {
    const { controls, breakpoints } = useMediaConfig()
    const neededBreakpoints =
        typeof controls === 'object' && !Array.isArray(controls) ? (Object.keys(controls) as Breakpoint[]) : []

    const breakpoint = useBreakpoint(breakpoints, neededBreakpoints)
    const _controls = useMemo(() => {
        const baseControls = controls || []
        const breakpointControls =
            typeof baseControls === 'object' && !Array.isArray(baseControls)
                ? breakpoint
                    ? baseControls[breakpoint]
                    : Object.values(baseControls)[0]
                : baseControls
        const grid = breakpointControls || []

        return grid
    }, [controls, breakpoint])

    return _controls
}
