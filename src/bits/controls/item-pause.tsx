/* ┐
   │ File: item-pause.tsx [/src/bits/controls/item-pause.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 4th, 2023 - 16:26:44
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaConfig, useMediaControls, useMediaState } from '@/media'

import svgPause from '@icons/pause.svg'

import ControlButton from './base-button'

/**
 * A button that pauses the media.\
 * Won't be rendered if the media can't be paused.\
 * Will be disabled if the media is not loaded, is not playing or if there's an error.
 */
export default function Pause() {
    const { canPause } = useMediaConfig()
    const { hasError, isLoaded, isPlaying } = useMediaState()
    const controls = useMediaControls()

    if (!canPause) return null

    return (
        <ControlButton
            id='rmp-controls-pause'
            controlKey='pause'
            size='lg'
            aria-label='Pause the media'
            icon={svgPause}
            onClick={controls.pause}
            disabled={!isLoaded || !isPlaying || !!hasError}
        />
    )
}
