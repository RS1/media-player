/* ┐
   │ File: wrapper.tsx [/src/bits/media/wrapper.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 15:30:29
   │ Modified: May 3rd, 2023 - 17:15:35
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import { usePlayerMode } from '@/media'

/**
 * Container for the media element.
 * If we're in audio mode, we hide the video element displaying
 * a 0x0 container. Otherwise, we render a 100%x100% container.
 */
function MediaWrapper(props: React.PropsWithChildren) {
    const { children } = props
    const playerMode = usePlayerMode()

    return (
        <div
            id='rmp-media-wrapper'
            className={clsx('absolute z-0 bg-media-bg', {
                'inset-0': playerMode === 'video',
                'w-0 h-0': playerMode !== 'video',
            })}
        >
            {children}
        </div>
    )
}

export default MediaWrapper
