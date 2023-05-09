/* ┐
   │ File: item-playpause.tsx [/src/bits/controls/item-playpause.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 9th, 2023 - 10:44:24
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaConfig, useMediaControls, useMediaState, usePlayerMode } from '@/media'

import svgPause from '@icons/pause.svg'
import svgPlay from '@icons/play.svg'

import ControlButton from './base-button'
import { CustomControlProps } from './types'

/**
 * A button that plays or pauses the media.\
 * Will be disabled if the media is not loaded, if there's an error, or if the media is playing and can't be paused.\
 * Will display a loading indicator if the media is not loaded and the player is in 'controls' mode.
 */
export default function PlayPause(props: CustomControlProps) {
    const { canPause } = useMediaConfig()
    const { hasError, isLoaded, isPlaying } = useMediaState()
    const controls = useMediaControls()
    const playerMode = usePlayerMode()

    return (
        <ControlButton
            {...props}
            id='rmp-controls-playpause'
            controlKey='playpause'
            size='lg'
            aria-label={isPlaying ? 'Pause the media' : 'Play the media'}
            icon={isPlaying ? svgPause : svgPlay}
            onClick={controls.togglePlay}
            loading={playerMode === 'controls' && !isLoaded && !hasError}
            disabled={!isLoaded || !!hasError || (isPlaying && !canPause)}
        />
    )
}
