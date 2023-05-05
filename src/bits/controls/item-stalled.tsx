/* ┐
   │ File: item-stalled.tsx [/src/bits/controls/item-stalled.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 5th, 2023 - 14:29:33
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaState } from '@/media'

import ControlButton from './base-button'

/**
 * A loading icon that shows when the media is stalled.\
 * Will render an empty div if the media is not stalled.\
 * **Note:** `stalled` is different from `loading`, it means that the player is expecting more data from the server, but it's not receiving it.
 */
export default function Stalled() {
    const { isStalled } = useMediaState()

    if (!isStalled) return <div />

    return (
        <ControlButton
            id='rmp-controls-stalled'
            controlKey='stalled'
            size='lg'
            label='Stalled'
            aria-label='The media is stalled'
            loading
            disabled
        />
    )
}
