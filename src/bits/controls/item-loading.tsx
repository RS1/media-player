/* ┐
   │ File: item-loading.tsx [/src/bits/controls/item-loading.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 9th, 2023 - 10:45:47
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
 * An icon that shows when the media is loading.\
 * Will render an empty div if the media is already loaded.\
 * **Note:** `loading` is different from `buffering`, `seeking` and `stalled`.
 * It means that the player is waiting for the media-source to load, and
 * this happens only once per playlist item.
 */
export default function Loading(props: CustomControlProps) {
    const { isLoaded } = useMediaState()

    if (isLoaded) return <div className='w-8 h-8' />

    return (
        <ControlButton
            {...props}
            id='rmp-controls-loading'
            controlKey='loading'
            size='lg'
            label='Loading'
            aria-label='The media is loading'
            loading
        />
    )
}
