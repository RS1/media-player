/* ┐
   │ File: item-artist.tsx [/src/bits/controls/item-artist.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 16:57:37
   │ Modified: May 4th, 2023 - 16:43:16
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useTrack } from '@/media'

import BaseMeta from './base-text'

/**
 * A text label showing the current track's artist.\
 * Won't be rendered if the track has no artist.
 */
export default function Artist() {
    const [track] = useTrack()
    return <BaseMeta id='rmp-controls-artist' text={track?.artist} />
}
