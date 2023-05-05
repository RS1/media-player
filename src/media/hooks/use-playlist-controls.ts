/* ┐
   │ File: use-playlist-controls.ts [/src/media/hooks/use-playlist-controls.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 14:49:55
   │ Modified: May 4th, 2023 - 12:17:21
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useContext } from 'react'

import { PlaylistContext } from '@media/providers/playlist'

/**
 * Use this hook to access the playlist controls anywhere within a `MediaProvider`.
 * @returns {PlaylistControls} A collection of functions to control the playlist.
 * @see {@link PlaylistControls}
 * @example
 * ```js
 * const { setTrack, skipTrackBy, toggleShuffle } = usePlaylistControls()
 *
 * // Skip to the next track
 * skipTrackBy(1)
 *
 * // Go to track 5
 * setTrack(5)
 *
 * // Enable/disable shuffle
 * toggleShuffle()
 * ```
 */
export const usePlaylistControls = () => {
    const cx = useContext(PlaylistContext)
    if (!cx) {
        throw new Error('usePlaylistControls must be used within a MediaProvider')
    }
    return cx.controls
}
