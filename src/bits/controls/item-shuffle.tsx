/* ┐
   │ File: item-shuffle.tsx [/src/bits/controls/item-shuffle.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 4th, 2023 - 16:32:53
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaConfig, usePlaylistControls, usePlaylistState } from '@/media'

import svgShuffle from '@icons/shuffle.svg'

import ControlButton from './base-button'

/**
 * A button that toggles the shuffle mode of the playlist.\
 * Won't be rendered if the playlist can't shuffle.
 */
export default function Shuffle() {
    const { canShuffle } = useMediaConfig()
    const { shuffle } = usePlaylistState()
    const controls = usePlaylistControls()

    if (!canShuffle) return null

    return (
        <ControlButton
            id='rmp-controls-shuffle'
            controlKey='shuffle'
            size='sm'
            aria-label='Shuffle the playlist'
            icon={svgShuffle}
            onClick={controls.toggleShuffle}
            active={shuffle}
        />
    )
}
