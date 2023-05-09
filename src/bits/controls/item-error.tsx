/* ┐
   │ File: item-error.tsx [/src/bits/controls/item-error.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 9th, 2023 - 10:46:46
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaState } from '@/media'

import ControlButton from './base-button'
import { CustomControlProps } from './types'

/**
 * An icon that shows when an error occurs while loading the media.\
 * Will render an empty div if there's no error.
 */
export default function Error(props: CustomControlProps) {
    const { hasError } = useMediaState()

    if (!hasError) return <div className='w-4 h-4' />

    return (
        <ControlButton
            {...props}
            id='rmp-controls-error'
            controlKey='error'
            size='sm'
            label='Error'
            aria-label='An error occurred while loading the media'
            error
        />
    )
}
