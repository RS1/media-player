/* ┐
   │ File: index.tsx [/src/bits/layers/index.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 16:45:13
   │ Modified: May 3rd, 2023 - 16:11:17
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import { usePlayerMode, useMediaConfig, useMediaElement, useMediaState } from '@/media'

import useDetectInteraction from '@hooks/use-detect-interaction'

import ControlsLayer from './controls-layer'
import ErrorLayer from './error-layer'
import InteractionLayer from './interaction-layer'
import LoadingLayer from './loading-layer'

function MediaLayerStack() {
    const controlsLayer = React.useRef<HTMLDivElement>(null)
    const { autoHideControls } = useMediaConfig()
    const { isPictureInPicture, isPlaying, isWaiting } = useMediaState()
    const playerMode = usePlayerMode()
    const { container } = useMediaElement()
    const isInteracting = useDetectInteraction(
        container,
        controlsLayer.current,
        true,
        typeof autoHideControls === 'number' ? autoHideControls : 3000,
    )

    const inImmersiveMode = isPlaying && !isWaiting && (!isInteracting || !autoHideControls) && !isPictureInPicture

    if (isPictureInPicture || playerMode === 'controls') return null

    return (
        <div
            id='rmp-media-layer-stack'
            className={clsx(
                'absolute z-0 left-0 top-0 w-full',
                playerMode === 'video' && 'h-full',
                playerMode !== 'video' && 'pt-[100%]',
                inImmersiveMode && 'cursor-none',
            )}
        >
            <ErrorLayer />
            <LoadingLayer />
            <InteractionLayer />
            {playerMode === 'video' && <ControlsLayer ref={controlsLayer} visible={!inImmersiveMode} />}
        </div>
    )
}

export default MediaLayerStack
