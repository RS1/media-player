/* ┐
   │ File: use-track.ts [/src/media/hooks/use-track.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 14:49:55
   │ Modified: May 4th, 2023 - 12:14:23
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useContext } from 'react'

import { PlaylistContext } from '@media/providers/playlist'

/**
 * Use this hook to access the current track anywhere within the `MediaProvider`.
 * The value returned by this hook works the same way as `useState`, so you can use it to update the current track.
 * @example
 * ```js
 * const [track, setTrack] = useTrack()
 *
 * // Option 1: Update the track directly
 * const changeTrackDirectly = useCallback(() => {
 *    if (track?.title === 'Never Gonna Give You Up') {
 *       setTrack({
 *          title: 'Never Gonna Let You Down',
 *          artist: 'Rick Astley',
 *          album: 'Whenever You Need Somebody',
 *       })
 *    }
 * }, [track, setTrack])
 *
 * // Option 2: Update the track based on the previous value
 * const changeTrack = useCallback(() => setTrack(t => {
 *    if (t?.title !== 'Never Gonna Give You Up') return t
 *    return {
 *       title: 'Never Gonna Let You Down',
 *       artist: 'Rick Astley',
 *       album: 'Whenever You Need Somebody',
 *    }
 * }), [setTrack])
 *
 * if (!track) return null
 *
 * return (
 *    <div>
 *       <h1>{track.title}</h1>
 *       <h2>{track.artist}</h2>
 *       <h3>{track.album}</h3>
 *       <button onClick={changeTrack}>Change track</button>
 *       <button onClick={changeTrackDirectly}>Change track directly</button>
 *    </div>
 * )
 * ```
 */
export const useTrack = () => {
    const cx = useContext(PlaylistContext)
    if (!cx) {
        throw new Error('useTrack must be used within a MediaProvider')
    }
    return cx.track
}
