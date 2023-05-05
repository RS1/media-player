/* ┐
   │ File: item-spacer.tsx [/src/bits/controls/item-spacer.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 16:55:13
   │ Modified: May 4th, 2023 - 16:33:25
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

/**
 * A spacer that fills any remaining space in the controls bar.\
 * Useful to push the controls to the left/right.
 */
export default function Spacer() {
    return <div className='rmp-controls-spacer w-full' />
}
