/* ┐
   │ File: item-fullscreen.tsx [/src/bits/controls/item-fullscreen.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 9th, 2023 - 14:25:45
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaConfig, useMediaControls, useMediaState, useTrack } from '@/media'

import { useFullscreenActive } from '@hooks/use-fullscreen-api'

import { isIOS } from '@utils/device-detect'

import svgFullscreenOff from '@icons/fullscreen-off.svg'
import svgFullscreenOn from '@icons/fullscreen-on.svg'

import ControlButton from './base-button'
import { CustomControlProps } from './types'

/**
 * A button that toggles fullscreen mode.\
 * Won't be rendered if fullscreen is not supported/allowed.
 */
export default function Fullscreen(props: CustomControlProps) {
    const [track] = useTrack()
    const { canFullscreen } = useMediaConfig()
    const { isFullscreen } = useMediaState()
    const controls = useMediaControls()
    const isFullscreenEnabled = useFullscreenActive()

    if (!canFullscreen || (!isFullscreenEnabled && (!isIOS || track?.type !== 'video'))) return null

    return (
        <ControlButton
            {...props}
            id='rmp-controls-fullscreen'
            controlKey='fullscreen'
            size='sm'
            aria-label='Enter fullscreen'
            icon={isFullscreen ? svgFullscreenOn : svgFullscreenOff}
            onClick={controls.toggleFullscreen}
            active={isFullscreen}
        />
    )
}
