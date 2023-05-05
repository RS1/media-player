/* ┐
   │ File: error.tsx [/src/bits/misc/error.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 21st, 2023 - 13:08:57
   │ Modified: May 2nd, 2023 - 12:47:17
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import svgError from '@icons/error.svg'

import SvgString from './svg-string'

const sizes = {
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 10,
} as const

type Props = {
    color?: string
    size?: keyof typeof sizes
}

function ErrorIcon(props: Props) {
    const { color, size = 'md' } = props
    return (
        <div className={clsx(`w-${sizes[size]} h-${sizes[size]}`)}>
            <SvgString svg={svgError} color={color} />
        </div>
    )
}

export default ErrorIcon
