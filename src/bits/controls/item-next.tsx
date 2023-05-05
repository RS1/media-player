/* ┐
   │ File: item-next.tsx [/src/bits/controls/item-next.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 4th, 2023 - 16:25:37
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaControls, usePlaylist } from '@/media'

import svgNext from '@icons/next.svg'

import ControlButton from './base-button'

/**
 * A button that skips to the next track.\
 * Won't be rendered if there's no playlist or if it has only one item.
 */
export default function Next() {
    const [playlist] = usePlaylist()
    const controls = useMediaControls()

    if (!playlist || playlist.length <= 1) return null

    return (
        <ControlButton
            id='rmp-controls-next'
            controlKey='next'
            size='sm'
            aria-label='Skip to next track'
            icon={svgNext}
            onClick={controls.next}
        />
    )
}
