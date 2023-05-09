/* ┐
   │ File: item-title.tsx [/src/bits/controls/item-title.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 16:57:37
   │ Modified: May 9th, 2023 - 10:40:01
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useTrack } from '@/media'

import BaseMeta from './base-text'
import { CustomControlProps } from './types'

/**
 * A text label showing the current track's title.\
 * Won't be rendered if the track has no title.
 */
export default function Title(props: CustomControlProps) {
    const [track] = useTrack()
    return <BaseMeta {...props} id='rmp-controls-title' text={track?.title} />
}
