/* ┐
   │ File: item-duration.tsx [/src/bits/controls/item-duration.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 21st, 2023 - 13:01:53
   │ Modified: May 4th, 2023 - 16:22:23
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import BaseTime from './base-time'

/**
 * A text label showing the current track's duration.\
 * Will be rendered as `--:--` if the track is not loaded.
 */
export default function Duration() {
    return <BaseTime id='rmp-controls-duration' type='duration' />
}
