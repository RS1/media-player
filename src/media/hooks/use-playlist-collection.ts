/* ┐
   │ File: use-playlist-collection.ts [/src/media/hooks/use-playlist-collection.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 15:01:29
   │ Modified: May 6th, 2023 - 15:38:44
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useContext } from 'react'

import { PlaylistContext } from '@media/providers/playlist'

/**
 * Use this hook to access the current playlist collection anywhere within the `MediaProvider`.\
 * The value returned by this hook works the same way as `useState`, so you can use
 * it to both read and update the playlist collection.
 * @example
 * ```js
 * const [collection, setCollection] = usePlaylistCollection()
 *
 * return (
 *    <div>
 *       <button onClick={() => setCollection([])}>Clear collection</button>
 *       <ul>
 *          {collection.map(playlist => (
 *             <li key={playlist.id}>
 *                <span>{playlist.title}</span>
 *                <ol>
 *                   {playlist.tracks.map(track => (
 *                      <li key={track.id}>{track.title}</li>
 *                   ))}
 *                </ol>
 *             </li>
 *          ))}
 *       </ul>
 *    </div>
 * )
 * ```
 */
export const usePlaylistCollection = () => {
    const cx = useContext(PlaylistContext)
    if (!cx) {
        throw new Error('usePlaylistCollection must be used within a MediaProvider')
    }
    return cx.collection
}
