/* ┐
   │ File: use-playlist-state.ts [/src/media/hooks/use-playlist-state.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 15:01:29
   │ Modified: May 4th, 2023 - 12:16:56
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useContext } from 'react'

import { PlaylistContext } from '@media/providers/playlist'

/**
 * Use this hook to access the playlist state anywhere within the `MediaProvider`.
 * @example
 * ```js
 * const playlistState = usePlaylistState()
 *
 * console.log('Is playlist shuffled?', playlistState.shuffle)
 * console.log('Is playlist repeating?', playlistState.mode === 'repeat')
 * console.log('Is playlist looping a single track?', playlistState.mode === 'repeat-one')
 * ```
 */
export const usePlaylistState = () => {
    const cx = useContext(PlaylistContext)
    if (!cx) {
        throw new Error('usePlaylistState must be used within a MediaProvider')
    }
    return cx.state
}
