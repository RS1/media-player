/* ┐
   │ File: use-player-mode.ts [/src/media/hooks/use-player-mode.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: May 2nd, 2023 - 10:09:12
   │ Modified: May 5th, 2023 - 12:25:38
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useMemo } from 'react'

// import { MediaPlayerMode } from '@media/types'
import { Breakpoint, useBreakpoint } from '@/hooks'

import { useMediaConfig } from './use-media-config'
import { useTrack } from './use-track'

const existingModes = ['auto', 'video', 'artwork', 'vinyl', 'controls', 'artwork-mini', 'vinyl-mini'] as const

/**
 * Use this hook anywhere within a `MediaProvider` to access the player mode currently in use.
 * @returns The current player mode.
 * @example
 * ```js
 * const playerMode = usePlayerMode()
 *
 * // Considering a configuration { playerMode: 'auto' }
 * console.log('Player mode is', playerMode) // -> 'video' or 'artwork' depending on the track type (video or audio)
 *
 * // Considering a configuration { playerMode: [['audio', 'vinyl'], ['video', 'video']] }
 * console.log('Player mode is', playerMode) // -> 'video' or 'vinyl' depending on the track type (video or audio)
 * ```
 */
export const usePlayerMode = () => {
    const { playerMode, breakpoints } = useMediaConfig()
    const neededBreakpoints =
        typeof playerMode === 'object' && !Array.isArray(playerMode) ? (Object.keys(playerMode) as Breakpoint[]) : []

    const breakpoint = useBreakpoint(breakpoints, neededBreakpoints)
    const [track] = useTrack()
    const _playerMode = useMemo(() => {
        const baseMode = playerMode ?? 'auto'
        const breakpointMode =
            typeof baseMode === 'object' && !Array.isArray(baseMode)
                ? breakpoint
                    ? baseMode[breakpoint]
                    : Object.values(baseMode)[0]
                : baseMode
        const mediaTypeMode = Array.isArray(breakpointMode)
            ? breakpointMode.find(m => Array.isArray(m) && m[0] === track?.type)?.[1]
            : breakpointMode
        const mode = mediaTypeMode ?? 'auto'

        if (mode === 'auto') {
            if (track?.type === 'video') return 'video'
            if (track?.type === 'audio') return 'artwork'
        } else if (existingModes.includes(mode)) return mode

        return 'artwork'
    }, [playerMode, track, breakpoint])

    return _playerMode
}
