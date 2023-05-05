/* ┐
   │ File: controls-layer.tsx [/src/bits/layers/controls-layer.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 21:37:28
   │ Modified: May 5th, 2023 - 12:41:56
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import ControlsGrid from '@bits/controls/controls-grid'

import { useMediaTheme, usePlayerControls } from '@/media'

import { colorStringToRGBA } from '@utils/color'

/**
 * This layer displays the controls configured in the media config.
 * Following the theme, it will be blurred and have a background color.
 * It can be hidden by setting the `visible` prop to `false`.
 * It doesn't render anything if there are no controls configured.
 */
function ControlsLayer(props: { style?: React.CSSProperties; visible: boolean }, ref: React.Ref<HTMLDivElement>) {
    const { style, visible = true } = props
    const { controlsBg } = useMediaTheme()
    const controls = usePlayerControls()

    const bgStyle = React.useMemo(() => {
        const bgColor = colorStringToRGBA(controlsBg, controlsBg)
        return {
            ...style,
            backgroundColor:
                typeof bgColor === 'string' ? bgColor : `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, 0.75)`,
        }
    }, [controlsBg, JSON.stringify(style)])

    if (controls.length === 0) return null

    return (
        <ControlsGrid
            className={clsx('absolute inset-x-0 bottom-0 backdrop-blur text-controls-color transition py-2 px-4', {
                'translate-y-full': !visible,
            })}
            style={bgStyle}
            elements={controls}
            ref={ref}
        />
    )
}

export default React.forwardRef(ControlsLayer)
