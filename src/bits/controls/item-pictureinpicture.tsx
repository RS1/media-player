/* ┐
   │ File: item-pictureinpicture.tsx [/src/bits/controls/item-pictureinpicture.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 4th, 2023 - 16:26:09
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaConfig, useMediaControls, useMediaState, usePlayerMode, useTrack } from '@/media'

import svgPictureInPictureOff from '@icons/picture-in-picture-off.svg'
import svgPictureInPictureOn from '@icons/picture-in-picture-on.svg'

import ControlButton from './base-button'

/**
 * A button that toggles Picture-in-Picture mode.\
 * Won't be rendered if Picture-in-Picture is not supported/allowed or if the media is not a video.
 */
export default function PictureInPicture() {
    const { canPictureInPicture } = useMediaConfig()
    const playerMode = usePlayerMode()
    const [track] = useTrack()
    const { isPictureInPicture } = useMediaState()
    const controls = useMediaControls()

    if (!canPictureInPicture || !(track?.type === 'video') || playerMode !== 'video') return null

    return (
        <ControlButton
            id='rmp-controls-pictureinpicture'
            controlKey='pictureinpicture'
            size='sm'
            aria-label='Enter Picture-in-Picture mode'
            icon={isPictureInPicture ? svgPictureInPictureOn : svgPictureInPictureOff}
            onClick={controls.togglePiP}
        />
    )
}
