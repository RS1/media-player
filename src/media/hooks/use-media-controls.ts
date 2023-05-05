/* ┐
   │ File: use-media-controls.ts [/src/media/hooks/use-media-controls.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 10:48:44
   │ Modified: May 4th, 2023 - 12:51:35
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useContext } from 'react'

import { CoreContext } from '@media/providers/core'

/**
 * Use this hook to access the media player controls anywhere within the `MediaProvider`.
 * You can use this to control the player from anywhere in your app, for example to skip to the next track.
 * @returns {MediaControls} A collection of functions to control the media player.
 * @see {@link MediaControls}
 * @example
 * ```js
 * const { togglePlay, seek, setVolume } = useMediaControls()
 *
 * // Play/pause the media player
 * togglePlay()
 *
 * // Seek to 1:30
 * seek(90)
 *
 * // Set the volume to 50%
 * setVolume(0.5)
 * ```
 */
export const useMediaControls = () => {
    const cx = useContext(CoreContext)
    if (!cx) {
        throw new Error('useMediaControls must be used within a MediaProvider')
    }
    return cx.controls
}
