/* ┐
   │ File: item-cast.tsx [/src/bits/controls/item-cast.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 9th, 2023 - 14:18:19
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaConfig, useMediaElement, useMediaState } from '@/media'

import useRemotePlaybackAPI from '@hooks/use-remote-playback-api'

import svgAirPlay from '@icons/airplay.svg'

import ControlButton from './base-button'
import { CustomControlProps } from './types'

/**
 * A button that shows the remote playback devices picker.\
 * Note: this button will be rendered only if the media can be streamed to a remote device.
 *
 * **WARNING:** this feature is still experimental and has a buggy behaviour, especially on iOS.
 */
export default function Cast(props: CustomControlProps) {
    const [hasPlayed, setHasPlayed] = React.useState(false)
    const { canRemotePlay } = useMediaConfig()
    const { node } = useMediaElement()
    const { isPlaying } = useMediaState()
    const { state, isAvailable, requestRemotePlayback } = useRemotePlaybackAPI(
        (node?.current ?? null) as HTMLVideoElement | null,
    )

    React.useEffect(() => {
        if (isPlaying) setHasPlayed(true)
    }, [isPlaying])

    if (!isAvailable || !canRemotePlay) return null

    return (
        <ControlButton
            {...props}
            id='rmp-controls-cast'
            controlKey='cast'
            size='sm'
            aria-label={state === 'disconnected' ? 'Stream to a remote device' : 'Stop streaming to a remote device'}
            icon={svgAirPlay}
            onClick={requestRemotePlayback}
            active={state === 'connected'}
            disabled={state === 'connecting' || (state === 'disconnected' && !hasPlayed)}
            title={!hasPlayed ? 'You need to start the player before streaming to a remote device' : undefined}
        />
    )
}
