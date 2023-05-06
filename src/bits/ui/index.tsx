/* ┐
   │ File: index.tsx [/src/bits/ui/index.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: May 2nd, 2023 - 9:55:46
   │ Modified: May 6th, 2023 - 21:24:36
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import MediaLayerStack from '@bits/layers'

import { useMediaState, usePlayerMode } from '@/media'

import MediaArtwork from './artwork'
import MediaVinyl from './vinyl'

const supportedModes = ['vinyl', 'vinyl-mini', 'artwork', 'artwork-mini'] as const

function MediaUIStack() {
    const stackRef = React.useRef<HTMLDivElement>(null)
    const playerMode = usePlayerMode()
    const { isFullscreen } = useMediaState()
    const isArtworkPlayer = playerMode === 'artwork' || playerMode === 'artwork-mini'
    const isVinylPlayer = playerMode === 'vinyl' || playerMode === 'vinyl-mini'
    // const isMiniPlayer = playerMode === 'vinyl-mini' || playerMode === 'artwork-mini'
    const [containerSize, setContainerSize] = React.useState<false | number>(false)

    React.useEffect(() => {
        if (!stackRef.current || !isFullscreen || (playerMode !== 'vinyl' && playerMode !== 'artwork')) {
            setContainerSize(false)
            return
        }

        const calculateSize = () => {
            if (!stackRef.current) return
            stackRef.current.style.width = '100%'
            const { width, height } = stackRef.current.getBoundingClientRect()
            const size = Math.min(width, height)
            stackRef.current.style.width = `${size}px`

            setContainerSize(size)
        }
        document.addEventListener('resize', calculateSize)
        calculateSize()

        return () => document.removeEventListener('resize', calculateSize)
    }, [stackRef, isFullscreen, playerMode])

    if (!supportedModes.some(m => m === playerMode)) return null

    return (
        <div
            id='rmp-media-ui-stack'
            ref={stackRef}
            className={clsx(
                'relative z-0 m-auto h-full aspect-1/1 flex items-center justify-center',
                !containerSize && 'w-full',
            )}
            style={containerSize ? { width: containerSize } : undefined}
        >
            {isVinylPlayer && <MediaVinyl stackRef={stackRef} />}
            {isArtworkPlayer && <MediaArtwork stackRef={stackRef} />}
            <MediaLayerStack />
        </div>
    )
}

export default MediaUIStack
