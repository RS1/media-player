/* ┐
   │ File: item-fullscreen.tsx [/src/bits/controls/item-fullscreen.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 4th, 2023 - 16:22:41
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaConfig, useMediaControls, useMediaState } from '@/media'

import svgFullscreenOff from '@icons/fullscreen-off.svg'
import svgFullscreenOn from '@icons/fullscreen-on.svg'

import ControlButton from './base-button'

/**
 * A button that toggles fullscreen mode.\
 * Won't be rendered if fullscreen is not supported/allowed.
 */
export default function Fullscreen() {
    const { canFullscreen } = useMediaConfig()
    const { isFullscreen } = useMediaState()
    const controls = useMediaControls()

    if (!canFullscreen) return null

    return (
        <ControlButton
            id='rmp-controls-fullscreen'
            controlKey='fullscreen'
            size='sm'
            aria-label='Enter fullscreen'
            icon={isFullscreen ? svgFullscreenOn : svgFullscreenOff}
            onClick={controls.toggleFullscreen}
        />
    )
}
