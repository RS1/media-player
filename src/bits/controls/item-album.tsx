/* ┐
   │ File: item-album.tsx [/src/bits/controls/item-album.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 16:57:37
   │ Modified: May 9th, 2023 - 10:47:24
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
 * A text label showing the current track's album.\
 * Won't be rendered if the track has no album.
 */
export default function Album(props: CustomControlProps) {
    const [track] = useTrack()
    return <BaseMeta {...props} id='rmp-controls-album' text={track?.album} />
}
