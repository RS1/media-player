/* ┐
   │ File: item-repeat.tsx [/src/bits/controls/item-repeat.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 9th, 2023 - 14:24:23
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaConfig, usePlaylistControls, usePlaylistState } from '@/media'

import svgLoop from '@icons/loop.svg'
import svgRepeat from '@icons/repeat.svg'

import ControlButton from './base-button'
import { CustomControlProps } from './types'

/**
 * A button that toggles the repeat mode of the playlist.\
 * Won't be rendered if the playlist can't loop.
 */
export default function Repeat(props: CustomControlProps) {
    const { canLoop } = useMediaConfig()
    const { mode } = usePlaylistState()
    const controls = usePlaylistControls()

    if (!canLoop) return null

    return (
        <ControlButton
            {...props}
            id='rmp-controls-repeat'
            controlKey='repeat'
            size='sm'
            aria-label={mode === 'repeat' ? 'Loop the current track' : 'Repeat the playlist'}
            icon={mode === 'repeat' ? svgRepeat : svgLoop}
            onClick={controls.toggleLoop}
            active={mode === 'repeat-one'}
        />
    )
}
