/* ┐
   │ File: use-media-state-updater.ts [/src/media/hooks/use-media-state-updater.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: February 28th, 2024 - 12:01:02
   │ Modified: February 28th, 2024 - 12:01:48
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useContext } from 'react'

import { StateUpdaterContext } from '@media/providers/state'
import { MediaState } from '..'
import { PartialStateReducer } from '@hooks/use-partial-state-reducer'

/**
 * Use this hook to access the setter of the state of the media player anywhere within the `MediaProvider`.
 * You can use this to control the player from anywhere in your app, for example to alter the immersive mode.
 * @returns {PartialStateReducer<MediaState>} The current playback state.
 * @see {@link MediaState}
 * @example
 * ```js
 * const updateState = useMediaStateUpdater()
 *
 * updateState({ isImmersive: true })
 * updateState(s => ({ isImmersive: !s.isImmersive }))
 * ```
 */
export const useMediaStateUpdater = (): PartialStateReducer<MediaState> => {
    const cx = useContext(StateUpdaterContext)
    if (!cx) {
        throw new Error('useMediaStateUpdater must be used within a MediaProvider')
    }
    return cx
}
