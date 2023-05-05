/* ┐
   │ File: player.tsx [/src/bits/player.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 16:45:13
   │ Modified: May 5th, 2023 - 14:34:15
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
    const { setContainerRef } = useMediaElement()

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
                isVideoPlayer
                    ? {
                          'overflow-hidden': true,
                          // Aspect ratio
                          [`aspect-${getAspectRatio(aspectRatio)}`]: hasSpecificAspectRatio,
                          // Sizing
                          'h-auto': aspectRatio === 'auto',
                          'h-full': aspectRatio === 'stretch',
                          'w-auto': !hasSpecificAspectRatio && !isFullscreen,
                          'w-full h-full': hasSpecificAspectRatio,
                          // Positioning
                          absolute: aspectRatio === 'auto' && !isFullscreen,
                          relative: aspectRatio === 'stretch' && !isFullscreen,
                          // Fullscreen
                          'rounded-sm': !isFullscreen,
                          'fixed inset-0 z-50 p-0 bg-media-bg': isFullscreen,
                      }
                    : {
                          'items-center justify-center': true,
                          'flex flex-col': !isMiniPlayer,
                          'grid grid-cols-[25%_75%]': isMiniPlayer,
                          // Padding & sizing
                          'w-full': true,
                          'p-6': !isMiniPlayer && playerBackground !== 'none' && !isControlsPlayer && !isFullscreen,
                          'p-4': isMiniPlayer && playerBackground !== 'none' && !isControlsPlayer && !isFullscreen,
                          'h-auto': !isMiniPlayer,
                          'h-44': isMiniPlayer,
                          // Positioning & fullscreen
                          relative: !isFullscreen,
                          'fixed inset-0 z-50 p-12 bg-media-bg': isFullscreen,
                      },
            )}
            style={
                videoAspectRatio
                    ? {
                          aspectRatio: videoAspectRatio,
                      }
                    : undefined
            }
            ref={setContainerRef}
        >
            {children}
        </div>
    )
}

export default Player
