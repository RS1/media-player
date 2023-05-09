/* ┐
   │ File: vinyl.tsx [/src/bits/ui/vinyl.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 15:30:29
   │ Modified: May 9th, 2023 - 10:03:12
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import { useMediaState, useTrack } from '@/media'

function MediaVinyl() {
    const [track] = useTrack()
    const { isPlaying } = useMediaState()

    return (
        <div
            id='rmp-media-vinyl'
            className={clsx(
                'relative drop-shadow-lg rounded-full overflow-hidden w-full pt-[100%]',
                'rmp-vinyl-hole',
                'rmp-vinyl-spin',
                {
                    'rmp-vinyl-spinning': isPlaying,
                },
            )}
        >
            {track?.cover && (
                <img
                    id='rmp-media-vinyl-artwork'
                    src={track.artwork}
                    alt={
                        [track.title, track.artist, track.album].filter(Boolean).join(' - ') ||
                        'Playing media vinyl artwork'
                    }
                    className='absolute top-0 left-0 w-full h-full object-cover object-center'
                />
            )}
            <div
                id='rmp-media-vinyl-outer-border'
                className={clsx('rmp-vinyl-outer-border absolute top-0 left-0 w-full h-full rounded-full')}
            />
            <div
                id='rmp-media-vinyl-inner-border'
                className={clsx(
                    'rmp-vinyl-inner-border absolute w-[12%] pt-[12%] rounded-full',
                    'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ',
                )}
            />
        </div>
    )
}

export default MediaVinyl
