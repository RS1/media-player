/* ┐
   │ File: item-seekbar.tsx [/src/bits/controls/item-seekbar.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 21st, 2023 - 11:16:21
   │ Modified: May 4th, 2023 - 16:32:36
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import { useMediaConfig, useMediaControls, useMediaTheme, useMediaTime, useMediaState } from '@/media'

import { useSlider } from '@/hooks'

const barStyle = 'absolute top-0 left-0 h-full transition-width bg-controls-color rounded-full'

/**
 * A seekbar that allows the user to seek through the current track.\
 * Will be rendered as a simple progress bar if the track is not seekable, not loaded or has an error.\
 * The seekbar is accessible via keyboard arrows when the handle is focused.
 */
function SeekBar() {
    const { canSeek: _canSeek } = useMediaConfig()
    const { hasError, isLoaded } = useMediaState()
    const timeState = useMediaTime()
    const controls = useMediaControls()
    const theme = useMediaTheme()

    const onChange = React.useCallback(
        (v: number) => {
            controls.setProgress(v)
        },
        [controls.setProgress],
    )

    const canSeek = _canSeek && !hasError && isLoaded

    const { value, props: sliderProps, isSliding } = useSlider(timeState.progress, { onChange })

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault()
                e.stopPropagation()
                controls.skip(-5)
            } else if (e.key === 'ArrowRight') {
                e.preventDefault()
                e.stopPropagation()
                controls.skip(5)
            }
        },
        [controls.skip],
    )

    return (
        <div
            id={'rmp-controls-seekbar'}
            className={clsx('w-full h-1 md:h-0.5 relative', 'mx-3 md:mx-0', canSeek && 'cursor-pointer')}
            {...(canSeek ? sliderProps : {})}
        >
            <div
                id='rmp-controls-seekbar-track'
                className={clsx(barStyle, 'opacity-30 w-full')}
                style={{
                    backgroundColor: theme['seekbar'],
                }}
            />
            <div
                id='rmp-controls-seekbar-buffer'
                className={clsx(barStyle, 'opacity-50')}
                style={{ width: `${timeState.buffered * 100}%`, backgroundColor: theme['seekbar'] }}
            />
            <div
                id='rmp-controls-seekbar-progress'
                className={clsx(barStyle, 'opacity-100')}
                style={{ width: `${value * 100}%`, backgroundColor: theme['seekbar'] }}
            />
            {canSeek && (
                <div
                    id='rmp-controls-seekbar-handle'
                    className={clsx(
                        'absolute top-1/2 w-1 h-4 md:w-0.5 md:h-2',
                        'bg-controls-color shadow rounded-full hover:bg-accent-color',
                        '-translate-x-1/2 -translate-y-1/2 transform-gpu',
                        'scale-100 transition hover:scale-125',
                        {
                            'cursor-grab': !isSliding,
                            'cursor-grabbing scale-150': isSliding,
                        },
                    )}
                    style={{ left: `${value * 100}%`, backgroundColor: theme['seekbar'] }}
                    tabIndex={0}
                    aria-label='Use the arrow keys to seek the media backward or forward'
                    onKeyDown={handleKeyDown}
                />
            )}
        </div>
    )
}

export default SeekBar
