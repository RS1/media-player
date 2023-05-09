/* ┐
   │ File: use-player-mode.ts [/src/media/hooks/use-player-mode.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: May 2nd, 2023 - 10:09:12
   │ Modified: May 9th, 2023 - 14:50:30
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useMemo } from 'react'

import { useConfigProperty } from './use-config-property'
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
    const [track] = useTrack()
    const { playerMode } = useMediaConfig()
    const mode = useConfigProperty(playerMode, 'auto')

    const _playerMode = useMemo(() => {
        if (mode === 'auto') {
            if (track?.type === 'video') return 'video'
            if (track?.type === 'audio') return 'artwork'
        } else if (existingModes.includes(mode)) return mode

        return 'artwork'
    }, [mode, track?.type])

    return _playerMode
}
