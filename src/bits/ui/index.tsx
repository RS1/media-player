/* ┐
   │ File: index.tsx [/src/bits/ui/index.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: May 2nd, 2023 - 9:55:46
   │ Modified: May 5th, 2023 - 14:23:38
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import MediaLayerStack from '@bits/layers'

import { usePlayerMode } from '@/media'

import MediaArtwork from './artwork'
import MediaVinyl from './vinyl'

const supportedModes = ['vinyl', 'vinyl-mini', 'artwork', 'artwork-mini'] as const

function MediaUIStack() {
    const playerMode = usePlayerMode()
    const isArtworkPlayer = playerMode === 'artwork' || playerMode === 'artwork-mini'
    const isVinylPlayer = playerMode === 'vinyl' || playerMode === 'vinyl-mini'
    const isMiniPlayer = playerMode === 'vinyl-mini' || playerMode === 'artwork-mini'

    if (!supportedModes.some(m => m === playerMode)) return null

    return (
        <div
            id='rmp-media-ui-stack'
            className={clsx('relative max-w-full max-h-full z-0 m-auto aspect-1/1', {
                'w-full': !isMiniPlayer,
                'w-full h-full': isMiniPlayer,
                'flex items-center justify-center': isMiniPlayer,
            })}
        >
            {isVinylPlayer && <MediaVinyl />}
            {isArtworkPlayer && <MediaArtwork />}
            <MediaLayerStack />
        </div>
    )
}

export default MediaUIStack
