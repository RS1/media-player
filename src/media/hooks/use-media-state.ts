/* ┐
   │ File: use-media-state.ts [/src/media/hooks/use-media-state.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 15:05:02
   │ Modified: May 4th, 2023 - 12:28:48
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useContext } from 'react'

import { StateContext } from '@media/providers/state'

/**
 * Use this hook to access the current state of the media player anywhere within the `MediaProvider`.
 * You can use this to react to changes in the player state, for example to show a loading indicator
 * when the player is buffering.
 * @returns {MediaState} The current playback state.
 * @see {@link MediaState}
 * @example
 * ```js
 * const { isWaiting } = useMediaState()
 *
 * return (
 *    <div>
 *       <CustomMediaPlayer />
 *       {isWaiting && <LoadingIndicator />}
 *    </div>
 * )
 * ```
 */
export const useMediaState = () => {
    const cx = useContext(StateContext)
    if (!cx) {
        throw new Error('useMediaState must be used within a MediaProvider')
    }
    return cx
}
