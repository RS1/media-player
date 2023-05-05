/* ┐
   │ File: use-media-time.ts [/src/media/hooks/use-media-time.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 15:05:02
   │ Modified: May 4th, 2023 - 13:07:06
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useContext } from 'react'

import { TimeContext } from '@media/providers/time'

/**
 * Use this hook to access the current time-state of the media player anywhere within a `MediaProvider`.
 * You can use this to react to changes in the player state, for
 * example to show a progress bar with the current time.
 * @returns {MediaTimeState} The current playback time-state.
 * @see {@link MediaTimeState}
 * @example
 * ```js
 * const { time, progress, duration, buffered } = useMediaTime()
 *
 * // Considering a media player for a track that lasts 3 minutes,
 * // with the playback at 1 minute and 30 seconds, and a currently
 * // buffered range from 1:00 to 2:06, the values would be:
 * console.log(time) // 90
 * console.log(progress) // 0.5
 * console.log(duration) // 180
 * console.log(buffered) // 0.7
 * ```
 */
export const useMediaTime = () => {
    const cx = useContext(TimeContext)
    if (!cx) {
        throw new Error('useMediaState must be used within a MediaProvider')
    }
    return cx
}
