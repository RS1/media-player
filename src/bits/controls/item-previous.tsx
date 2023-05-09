/* ┐
   │ File: item-previous.tsx [/src/bits/controls/item-previous.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 9th, 2023 - 10:43:24
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaControls, usePlaylist } from '@/media'

import svgPrevious from '@icons/previous.svg'

import ControlButton from './base-button'
import { CustomControlProps } from './types'

/**
 * A button that skips to the previous track.\
 * Won't be rendered if there's no playlist or if it has only one item.
 */
export default function Previous(props: CustomControlProps) {
    const [playlist] = usePlaylist()
    const controls = useMediaControls()

    if (!playlist || playlist.tracks.length <= 1) return null

    return (
        <ControlButton
            {...props}
            id='rmp-controls-previous'
            controlKey='previous'
            size='sm'
            aria-label='Skip to previous track'
            icon={svgPrevious}
            onClick={controls.previous}
        />
    )
}
