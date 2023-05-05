/* ┐
   │ File: error-layer.tsx [/src/bits/layers/error-layer.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 26th, 2023 - 10:43:51
   │ Modified: May 3rd, 2023 - 17:03:50
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import ErrorIcon from '@bits/misc/error'

import { useMediaState, useMediaTheme, usePlayerMode } from '@/media'

import { colorStringToRGBA } from '@utils/color'

/**
 * This layer is used to show an error message when the media fails to load.
 * It is shown on top of the media/artwork, and it is not visible when the
 * media is not in error state.
 */
function ErrorLayer() {
    const playerMode = usePlayerMode()
    const { controlsBg, errorColor } = useMediaTheme()
    const { hasError } = useMediaState()

    const bgStyle = React.useMemo(() => {
        const bgColor = colorStringToRGBA(controlsBg, controlsBg)
        return {
            backgroundColor:
                typeof bgColor === 'string' ? bgColor : `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, 0.75)`,
        }
    }, [controlsBg])

    const isMiniPlayer = playerMode === 'vinyl-mini' || playerMode === 'artwork-mini'

    if (!hasError) return null

    return (
        <div
            id='rmp-error-layer'
            className={clsx(
                'absolute inset-0 backdrop-blur',
                'flex items-center justify-center',
                'text-controls-color overflow-hidden',
                (playerMode === 'vinyl' || playerMode === 'vinyl-mini') && 'rounded-full',
            )}
            style={bgStyle}
        >
            {isMiniPlayer ? (
                <ErrorIcon color={errorColor} size={'xl'} />
            ) : (
                <p className='w-1/2 text-center text-error-color text-lg'>
                    {typeof hasError !== 'boolean' ? hasError : 'An error occurred while loading the media.'}
                </p>
            )}
        </div>
    )
}

export default ErrorLayer
