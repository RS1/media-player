/* ┐
   │ File: loading-layer.tsx [/src/bits/layers/loading-layer.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 26th, 2023 - 10:43:51
   │ Modified: May 3rd, 2023 - 14:46:27
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import Spinner from '@bits/misc/spinner'

import { usePlayerMode, useMediaState } from '@/media'

/**
 * This layer is used to show a loading indicator when the media is loading,
 * waiting for something or seeking. This provides the user with a visual
 * feedback that something is happening.
 */
function LoadingLayer() {
    const playerMode = usePlayerMode()
    const { hasError, isLoaded, isWaiting, isSeeking } = useMediaState()

    /**
     * If the media is loaded, not waiting for something and not seeking,
     * we don't need to show the loading layer.
     * NOTE: we may remove the `isSeeking` check, needs further testing.
     */
    if (hasError || (isLoaded && !isWaiting && !isSeeking)) return null

    return (
        <div
            id='rmp-loading-layer'
            className={clsx(
                'absolute inset-0',
                'flex items-center justify-center',
                'bg-media-bg text-controls-color opacity-50',
                'transition-[border-radius] ease-in-out duration-300',
                (playerMode === 'vinyl' || playerMode === 'vinyl-mini') && 'rounded-full',
                playerMode !== 'vinyl' && playerMode !== 'vinyl-mini' && 'rounded-none',
            )}
        >
            <Spinner size='xl' />
        </div>
    )
}

export default LoadingLayer
