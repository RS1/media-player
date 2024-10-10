/* ┐
   │ File: item-pictureinpicture.tsx [/src/bits/controls/item-pictureinpicture.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 9th, 2023 - 14:26:06
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaConfig, useMediaControls, useMediaState, useTrack } from '@/media'

import { usePiPActive } from '@hooks/use-pip-api'

import svgPictureInPictureOff from '@icons/picture-in-picture-off.svg'
import svgPictureInPictureOn from '@icons/picture-in-picture-on.svg'

import ControlButton from './base-button'
import { CustomControlProps } from './types'

/**
 * A button that toggles Picture-in-Picture mode.\
 * Won't be rendered if Picture-in-Picture is not supported/allowed or if the media is not a video.
 */
export default function PictureInPicture(props: CustomControlProps) {
    const { canPictureInPicture } = useMediaConfig()
    const [track] = useTrack()
    const { isPictureInPicture } = useMediaState()
    const controls = useMediaControls()
    const isPiPEnabled = usePiPActive()

    if (!canPictureInPicture || track?.type !== 'video' || !isPiPEnabled) return null

    return (
        <ControlButton
            {...props}
            id='rmp-controls-pictureinpicture'
            controlKey='pictureinpicture'
            size='sm'
            aria-label='Enter Picture-in-Picture mode'
            icon={isPictureInPicture ? svgPictureInPictureOn : svgPictureInPictureOff}
            onClick={controls.togglePiP}
            active={isPictureInPicture}
        />
    )
}
