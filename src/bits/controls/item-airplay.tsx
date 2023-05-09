/* ┐
   │ File: item-airplay.tsx [/src/bits/controls/item-airplay.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 15:39:52
   │ Modified: May 9th, 2023 - 14:26:13
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
import { CustomControlProps } from './types'
import Cast from './item-cast'

/**
 * A button that shows the AirPlay picker.\
 * Note: this button works only on Safari. It won't be rendered on other browsers.
 */
export default function AirPlay(props: CustomControlProps) {
    const { canAirPlay } = useMediaConfig()
    const { node } = useMediaElement()
    const { isActive, isAvailable, airPlayAPI } = useAirPlayAPI((node?.current ?? null) as HTMLVideoElement | null)

    if (!isAvailable) {
        return <Cast {...props} />
    } else if (!canAirPlay) return null

    return (
        <ControlButton
            {...props}
            id='rmp-controls-airplay'
            controlKey='airplay'
            size='sm'
            aria-label={!isActive ? 'Stream to AirPlay device' : 'Stop streaming to AirPlay device'}
            icon={svgAirPlay}
            onClick={airPlayAPI?.showPicker}
            active={isActive}
        />
    )
}
