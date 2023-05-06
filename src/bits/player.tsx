/* ┐
   │ File: player.tsx [/src/bits/player.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 16:45:13
   │ Modified: May 6th, 2023 - 21:25:10
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import {
    getAspectRatio,
    usePlayerMode,
    useMediaConfig,
    useMediaElement,
    useMediaState,
    usePlayerBackground,
} from '@/media'

function Player(props: React.PropsWithChildren) {
    const { children } = props
    const { aspectRatio } = useMediaConfig()
    const playerBackground = usePlayerBackground()

    const { intrinsicSize, isFullscreen } = useMediaState()
    // const { setContainerRef } = useMediaElement()

    const playerMode = usePlayerMode()

    const isVideoPlayer = playerMode === 'video'
    const isMiniPlayer = playerMode === 'artwork-mini' || playerMode === 'vinyl-mini'
    const isControlsPlayer = playerMode === 'controls'

    const hasSpecificAspectRatio = aspectRatio !== 'auto' && aspectRatio !== 'stretch'
    const videoAspectRatio =
        isVideoPlayer && aspectRatio === 'auto' ? (intrinsicSize[0] || 1) / (intrinsicSize[1] || 1) : false

    return (
        <div
            id='rmp-player'
            className={clsx(
                'select-none font-sans',
                'text-controls-color',
                'max-w-full max-h-full m-auto',
                isFullscreen ? 'fixed inset-0 z-50 bg-media-bg' : 'relative',
                isVideoPlayer
                    ? {
                          // Sizing
                          'w-full h-full overflow-hidden': true,
                          // Aspect ratio
                          [`aspect-${getAspectRatio(aspectRatio)}`]: hasSpecificAspectRatio,
                          // Fullscreen
                          'rounded-sm': !isFullscreen,
                          'p-0': isFullscreen,
                      }
                    : {
                          'items-center justify-center': true,
                          'grid grid-cols-1 grid-rows-[minmax(0,1fr)_auto]': !isMiniPlayer,
                          'grid grid-cols-[minmax(0,_25fr)_minmax(0,_75fr)]': isMiniPlayer,
                          // Padding & sizing
                          'w-full': true,
                          'p-6': !isMiniPlayer && playerBackground !== 'none' && !isControlsPlayer && !isFullscreen,
                          'p-4': isMiniPlayer && playerBackground !== 'none' && !isControlsPlayer && !isFullscreen,
                          'h-auto': !isMiniPlayer && !isFullscreen,
                          'h-44': isMiniPlayer && !isFullscreen,
                          // Positioning & fullscreen
                          'p-12': isFullscreen,
                      },
            )}
            style={
                videoAspectRatio
                    ? {
                          aspectRatio: videoAspectRatio,
                      }
                    : undefined
            }
            // ref={setContainerRef}
        >
            {children}
        </div>
    )
}

export default Player
