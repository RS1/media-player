/* ┐
   │ File: item-play.tsx [/src/bits/controls/item-play.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 9th, 2023 - 10:44:35
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaControls, useMediaState } from '@/media'

import svgPlay from '@icons/play.svg'

import ControlButton from './base-button'
import { CustomControlProps } from './types'

/**
 * A button that plays the media.\
 * Will be disabled if the media is not loaded, is already playing or if there's an error.
 */
export default function Play(props: CustomControlProps) {
    const { hasError, isLoaded, isPlaying } = useMediaState()
    const controls = useMediaControls()

    return (
        <ControlButton
            {...props}
            id='rmp-controls-play'
            controlKey='play'
            size='lg'
            aria-label='Play the media'
            icon={svgPlay}
            onClick={controls.play}
            disabled={!isLoaded || isPlaying || !!hasError}
        />
    )
}
