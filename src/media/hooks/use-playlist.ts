/* ┐
   │ File: use-playlist.ts [/src/media/hooks/use-playlist.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 15:01:29
   │ Modified: May 6th, 2023 - 15:00:05
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useContext } from 'react'

import { PlaylistContext } from '@media/providers/playlist'

/**
 * Use this hook to access the current playlist anywhere within the `MediaProvider`.\
 * The value returned by this hook works the same way as `useState`, so you can use
 * it to both read and update the active playlist.
 * @example
 * ```js
 * const [playlist, setPlaylist] = usePlaylist()
 *
 * return (
 *    <div>
 *       <button onClick={() => setPlaylist(null)}>Clear playlist</button>
 *       {playlist && (
 *          <ul>
 *             {playlist.tracks.map(({ title, id }) => (
 *                <li key={id}>{title}</li>
 *             ))}
 *          </ul>
 *       )}
 *    </div>
 * )
 * ```
 */
export const usePlaylist = () => {
    const cx = useContext(PlaylistContext)
    if (!cx) {
        throw new Error('usePlaylist must be used within a MediaProvider')
    }
    return cx.playlist
}
