/* ┐
   │ File: controls.tsx [/src/bits/ui/controls.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 21:37:28
   │ Modified: May 5th, 2023 - 14:27:44
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React, { useMemo } from 'react'

import List from '@bits/controls/controls-grid'

import { usePlayerBackground, usePlayerControls, usePlayerMode } from '@/media'

function MediaControls(props: { className?: string; style?: React.CSSProperties }) {
    const { className, style } = props
    const playerMode = usePlayerMode()
    const controls = usePlayerControls()
    const playerBackground = usePlayerBackground()

    const bgStyle = useMemo(
        () => ({
            ...style,
        }),
        [JSON.stringify(style)],
    )

    if (playerMode === 'video' || controls.length === 0) return null

    return (
        <List
            id='rmp-media-ui-controls'
            className={clsx(
                'text-controls-color z-10 max-w-full',
                {
                    'mt-6': playerMode === 'vinyl' || playerMode === 'artwork',
                    // 'ml-4': playerMode === 'vinyl-mini' || playerMode === 'artwork-mini',
                    'p-4': playerMode === 'controls' && playerBackground !== 'none',
                    'py-0.5': playerMode !== 'controls',
                    'px-2': playerMode !== 'vinyl-mini' && playerMode !== 'artwork-mini' && playerMode !== 'controls',
                    'pl-4 pr-2': playerMode === 'vinyl-mini' || playerMode === 'artwork-mini',
                },
                className,
            )}
            style={bgStyle}
            elements={controls}
        />
    )
}

export default MediaControls
