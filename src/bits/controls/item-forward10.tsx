/* ┐
   │ File: item-forward10.tsx [/src/bits/controls/item-forward10.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 9th, 2023 - 10:46:38
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaConfig, useMediaControls, useMediaState } from '@/media'

import svgForward10 from '@icons/forward10.svg'

import ControlButton from './base-button'
import { CustomControlProps } from './types'

/**
 * A button that skips forward 10 seconds.\
 * Won't be rendered if the media can't be seeked.
 */
export default function Forward10(props: CustomControlProps) {
    const { canSeek } = useMediaConfig()
    const { hasError, isLoaded } = useMediaState()
    const controls = useMediaControls()

    if (!canSeek) return null

    return (
        <ControlButton
            {...props}
            id='rmp-controls-forward10'
            controlKey='forward10'
            size='sm'
            aria-label='Skip forward 10 seconds'
            icon={svgForward10}
            onClick={() => controls.skip(10)}
            disabled={!isLoaded || !!hasError}
        />
    )
}
