/* ┐
   │ File: spinner.tsx [/src/bits/misc/spinner.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 21st, 2023 - 13:08:57
   │ Modified: April 27th, 2023 - 12:22:32
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

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

function Spinner(props: Props) {
    const { color, size = 'md' } = props
    return (
        <div
            className={clsx('grid grid-cols-2 animate-spin', `w-${sizes[size]} h-${sizes[size]}`, {
                'gap-1': size === 'xs' || size === 'sm',
                'gap-2': size === 'md' || size === 'lg',
                'gap-3': size === 'xl',
            })}
        >
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className={clsx('rounded-full', {
                        'bg-controls-color': !color,
                    })}
                    style={{
                        backgroundColor: color,
                    }}
                />
            ))}
        </div>
    )
}

export default Spinner
