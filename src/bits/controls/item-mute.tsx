/* ┐
   │ File: item-mute.tsx [/src/bits/controls/item-mute.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 4th, 2023 - 16:24:33
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaConfig, useMediaControls, useMediaState } from '@/media'

import svgMuted from '@icons/muted.svg'
import svgUnmuted from '@icons/unmuted.svg'

import ControlButton from './base-button'

/**
 * A button that toggles the mute state of the media.\
 * Won't be rendered if muting is not supported/allowed.
 */
export default function Mute() {
    const { canMute } = useMediaConfig()
    const { isMuted } = useMediaState()
    const controls = useMediaControls()

    if (!canMute) return null

    return (
        <ControlButton
            id='rmp-controls-mute'
            controlKey='mute'
            size='sm'
            aria-label='Mute the media'
            icon={isMuted ? svgMuted : svgUnmuted}
            onClick={controls.toggleMute}
        />
    )
}
