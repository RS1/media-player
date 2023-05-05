/* ┐
   │ File: icon-flasher.tsx [/src/bits/misc/icon-flasher.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 27th, 2023 - 10:43:12
   │ Modified: April 27th, 2023 - 12:22:32
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import { Stage, Transition } from 'transition-hook'

import SvgString from './svg-string'

const TransitionJSX = Transition as ({
    state,
    timeout,
    children,
}: {
    state: boolean
    timeout: number
    children: (stage: Stage, shouldMount: boolean) => React.ReactNode
}) => JSX.Element

const animations = {
    scaleUp: (stage: Stage) =>
        clsx({
            'scale-0 opacity-0': stage === 'from',
            'scale-75 opacity-75': stage === 'enter',
            'scale-125 opacity-0': stage === 'leave',
        }),
    scaleDown: (stage: Stage) =>
        clsx({
            'scale-125 opacity-0': stage === 'from',
            'scale-75 opacity-75': stage === 'enter',
            'scale-0 opacity-0': stage === 'leave',
        }),
    pushLeft: (stage: Stage) =>
        clsx({
            'translate-x-1/2 scale-0 opacity-0': stage === 'from',
            'translate-x-0 scale-75 opacity-75': stage === 'enter',
            '-translate-x-1/2 scale-75 opacity-0': stage === 'leave',
        }),
    pushRight: (stage: Stage) =>
        clsx({
            '-translate-x-1/2 scale-0 opacity-0': stage === 'from',
            'translate-x-0 scale-75 opacity-75': stage === 'enter',
            'translate-x-1/2 scale-75 opacity-0': stage === 'leave',
        }),
} as const

function IconFlasher({
    icon,
    flash,
    duration,
    animation = 'scaleUp',
    size = 'sm',
}: {
    icon: string
    flash: boolean
    duration: 75 | 100 | 150 | 200 | 300
    animation?: keyof typeof animations
    size?: 'sm' | 'md' | 'lg'
}) {
    return (
        <TransitionJSX state={flash} timeout={duration}>
            {(stage, shouldMount) =>
                shouldMount && (
                    <SvgString
                        svg={icon}
                        className={clsx(
                            'h-1/6 transition-transfom transform-gpu ease-linear drop-shadow-2xl',
                            size === 'sm' && 'w-1/6',
                            size === 'md' && 'w-1/4',
                            size === 'lg' && 'w-1/3',
                            duration === 75 && 'duration-75',
                            duration === 100 && 'duration-100',
                            duration === 150 && 'duration-150',
                            duration === 200 && 'duration-200',
                            duration === 300 && 'duration-300',
                            animations[animation](stage),
                        )}
                    />
                )
            }
        </TransitionJSX>
    )
}

export default IconFlasher
