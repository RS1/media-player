/* ┐
   │ File: item-airplay.tsx [/src/bits/controls/item-airplay.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 4th, 2023 - 16:22:01
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaConfig, useMediaElement } from '@/media'

import useAirPlayAPI from '@hooks/use-airplay-api'

import svgAirPlay from '@icons/airplay.svg'

import ControlButton from './base-button'

/**
 * A button that shows the AirPlay picker.\
 * Note: this button works only on Safari. It won't be rendered on other browsers.
 */
export default function AirPlay() {
    const { canAirPlay } = useMediaConfig()
    const { node } = useMediaElement()
    const { isAvailable, airPlayAPI } = useAirPlayAPI((node?.current ?? null) as HTMLVideoElement | null)

    if (!isAvailable || !canAirPlay) return null

    return (
        <ControlButton
            id='rmp-controls-airplay'
            controlKey='airplay'
            size='sm'
            aria-label='Stream to AirPlay device'
            icon={svgAirPlay}
            onClick={airPlayAPI?.showPicker}
        />
    )
}
