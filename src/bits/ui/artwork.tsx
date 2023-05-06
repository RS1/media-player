/* ┐
   │ File: artwork.tsx [/src/bits/ui/artwork.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 15:30:29
   │ Modified: May 6th, 2023 - 21:30:02
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import { useMediaState, useTrack } from '@/media'

function MediaArtwork() {
    const [track] = useTrack()
    const { isPlaying } = useMediaState()

    return (
        <div
            id='rmp-media-artwork'
            className={clsx(
                'relative bg-media-bg shadow-lg m-auto transition rounded-sm overflow-hidden',
                'w-full pt-[100%]',
                !isPlaying && 'scale-95',
            )}
        >
            {track && (
                <img
                    src={track.artwork || track.poster}
                    alt={[track.title, track.artist, track.album].filter(Boolean).join(' - ')}
                    className='absolute top-0 left-0 w-full h-full object-cover object-center'
                />
            )}
        </div>
    )
}

export default MediaArtwork
