/* ┐
   │ File: interaction-layer.tsx [/src/bits/layers/interaction-layer.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 26th, 2023 - 10:57:23
   │ Modified: May 4th, 2023 - 9:54:09
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import IconFlasher from '@bits/misc/icon-flasher'

import { useMediaConfig, useMediaControls, useMediaState, usePlayerMode } from '@/media'

import { useDoubleTap, useAutoRevertToggle, usePrevious } from '@/hooks'

import svgNext from '@icons/next.svg'
import svgPause from '@icons/pause.svg'
import svgPlay from '@icons/play.svg'
import svgPrevious from '@icons/previous.svg'

/**
 * This layer is responsible for handling user interaction with the media.
 * It allows the user to pause the media by tapping on it and to seek
 * forward and backward by double-tapping on the right and left side of the
 * media respectively. It also flashes the play/pause and seek icons when
 * the media is played/paused or seeked.
 */
function InteractionLayer() {
    const { canPause, canSeek, canTapToPause, canDoubleTapToSeek } = useMediaConfig()
    const { hasError, isLoaded, isPlaying, isSeeking } = useMediaState()
    const controls = useMediaControls()
    const playerMode = usePlayerMode()

    /**
     * Initialize the double-tap handlers for skipping back and forward
     * in the media on double-tap.
     */
    const handleBack = useDoubleTap({
        onDoubleTap: () => controls.skip(-10),
        onSingleTap: canPause && canTapToPause ? controls.togglePlay : undefined,
    })
    const handleForward = useDoubleTap({
        onDoubleTap: () => controls.skip(10),
        onSingleTap: canPause && canTapToPause ? controls.togglePlay : undefined,
    })

    /**
     * We flash the play/pause icon when the media is played or paused.
     * The icon is flashed for `150ms` and then it's removed from the DOM.
     */
    const wasPlaying = usePrevious<boolean>(isPlaying)
    const [showClickIcon, toggleClickIcon] = useAutoRevertToggle<boolean>(150)
    React.useEffect(() => {
        // We check for `wasPlaying` to avoid flashing the icon when the media is first loaded.
        if (isPlaying !== wasPlaying) {
            toggleClickIcon()
        }
    }, [isPlaying])

    /**
     * We flash the seek icons when the media is seeked either forward or backward.
     * The icon is flashed for `150ms` and then it's removed from the DOM.
     */
    const [showSeekIcon, toggleSeekIcon] = useAutoRevertToggle<'forward' | 'backward'>(150)
    React.useEffect(() => {
        if (isSeeking) {
            toggleSeekIcon(isSeeking)
        }
    }, [isSeeking])

    /**
     * We don't need parts of this layer if we are in `mini` mode.
     * Specifically, we don't need the seek backward/forward zones,
     * nor we need the flashing icons. The area available is too small.
     */
    const isMiniPlayer = playerMode === 'artwork-mini' || playerMode === 'vinyl-mini'

    /**
     * This layer is not needed if there is no interaction allowed.
     */
    if ((!canPause || !canTapToPause) && (!canSeek || !canDoubleTapToSeek)) return null

    return (
        <div id='rmp-interaction-layer' className='absolute inset-0 flex'>
            {!isMiniPlayer && canSeek && canDoubleTapToSeek && (
                <div
                    id='rmp-interaction-layer-backward'
                    className='flex-1 flex items-center justify-start pl-4'
                    onClick={hasError || !isLoaded ? undefined : handleBack}
                >
                    <IconFlasher
                        icon={svgPrevious}
                        flash={showSeekIcon === 'backward'}
                        duration={150}
                        animation='pushLeft'
                        size='sm'
                    />
                </div>
            )}
            {canPause && canTapToPause && (
                <div
                    id='rmp-interaction-layer-playpause'
                    className='flex-1 flex items-center justify-center'
                    onClick={hasError || !isLoaded ? undefined : controls.togglePlay}
                >
                    {!isMiniPlayer && (
                        <IconFlasher
                            icon={isPlaying ? svgPause : svgPlay}
                            flash={showClickIcon}
                            duration={150}
                            animation='scaleUp'
                            size='md'
                        />
                    )}
                </div>
            )}
            {!isMiniPlayer && canSeek && canDoubleTapToSeek && (
                <div
                    id='rmp-interaction-layer-forward'
                    className='flex-1 flex items-center justify-end pr-4'
                    onClick={hasError || !isLoaded ? undefined : handleForward}
                >
                    <IconFlasher
                        icon={svgNext}
                        flash={showSeekIcon === 'forward'}
                        duration={150}
                        animation='pushRight'
                        size='sm'
                    />
                </div>
            )}
        </div>
    )
}

export default InteractionLayer
