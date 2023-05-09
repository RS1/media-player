/* ┐
   │ File: background.tsx [/src/bits/ui/background.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: May 3rd, 2023 - 11:28:14
   │ Modified: May 9th, 2023 - 10:18:33
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import { useMediaState, usePlayerBackground, usePlayerMode, useTrack } from '@/media'

export default function MediaBackground() {
    const [track] = useTrack()
    const { isFullscreen } = useMediaState()
    const playerMode = usePlayerMode()
    const playerBackground = usePlayerBackground()

    if (playerMode === 'video' || playerBackground === 'none') return null

    return (
        <div
            id='rmp-media-background'
            className={clsx(
                'absolute top-0 left-0 w-full h-full z-0 bg-controls-bg overflow-hidden shadow-lg',
                'transition-[border-radius] ease-in-out duration-300',
                {
                    rounded: playerMode !== 'vinyl-mini' && !isFullscreen,
                    'rounded-l-[5.5rem] rounded-r': playerMode === 'vinyl-mini' && !isFullscreen,
                },
            )}
        >
            {playerBackground === 'blur' && (
                <>
                    {track?.artwork && (
                        <img
                            src={track.artwork}
                            alt=''
                            className='absolute top-0 left-0 w-full h-full object-cover object-center scale-110 blur-3xl'
                            aria-hidden='true'
                        />
                    )}
                    {/* It used to have a `mix-blend-luminosity` filter, but it causes a weird bug in Safari iOS */}
                    <div className='absolute top-0 left-0 w-full h-full bg-controls-bg opacity-75 mix-blend-luminosity' />
                </>
            )}
        </div>
    )
}
