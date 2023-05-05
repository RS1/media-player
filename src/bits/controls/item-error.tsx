/* ┐
   │ File: item-error.tsx [/src/bits/controls/item-error.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 5th, 2023 - 14:29:47
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
 * An icon that shows when an error occurs while loading the media.\
 * Will render an empty div if there's no error.
 */
export default function Error() {
    const { hasError } = useMediaState()

    if (!hasError) return <div />

    return (
        <ControlButton
            id='rmp-controls-error'
            controlKey='error'
            size='sm'
            label='Error'
            aria-label='An error occurred while loading the media'
            error
        />
    )
}
