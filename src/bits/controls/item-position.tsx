/* ┐
   │ File: item-position.tsx [/src/bits/controls/item-position.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 16:57:37
   │ Modified: May 9th, 2023 - 10:44:10
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import { useTrack } from '@/media'

import BaseTag from './base-tag'
import { CustomControlProps } from './types'

/**
 * A text label showing the current track's position (with prefix/suffix).\
 * Won't be rendered if the track has no prefix, suffix, and position.
 */
export default function Position(props: CustomControlProps) {
    const [track] = useTrack()

    return (
        <BaseTag
            {...props}
            id='rmp-controls-position'
            controlKey='position'
            className={clsx('opacity-50', props.className)}
            text={`${track?.prefix || ''}${track?.position || ''}${track?.suffix || ''}`}
        />
    )
}
