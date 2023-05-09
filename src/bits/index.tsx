/* ┐
   │ File: index.tsx [/src/bits/index.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 16:45:13
   │ Modified: May 9th, 2023 - 15:00:57
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import MediaLayerStack from '@bits/layers'
import Media from '@bits/media'
import Player from '@bits/player'
import MediaUIStack from '@bits/ui'
import MediaBackground from '@bits/ui/background'
import MediaControls from '@bits/ui/controls'

import { usePlayerMode, useMediaTheme, themeToCSSVars, useMediaElement, usePlayerRatio } from '@/media'

import '@css/tailwind.css'

type Props = {
    style?: React.CSSProperties
    className?: string
} & Exclude<React.HTMLAttributes<HTMLDivElement>, 'id' | 'style' | 'className'>

function MediaPlayer(props: Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) {
    const { style, className, ...rest } = props
    const playerRatio = usePlayerRatio()
    const theme = useMediaTheme()
    const playerMode = usePlayerMode()
    const { setContainerRef } = useMediaElement()
    const wrapperRef = React.useCallback((node: HTMLDivElement) => {
        if (forwardedRef) {
            if (typeof forwardedRef === 'function') {
                forwardedRef(node)
            } else {
                forwardedRef.current = node
            }
        }
        setContainerRef?.(node)
    }, [])

    const rmpStyle: React.CSSProperties = React.useMemo(
        () => ({
            ...(themeToCSSVars(theme) as React.CSSProperties),
            ...style,
            width: playerRatio === 'stretch' ? '100%' : 'auto',
            margin: playerRatio === 'stretch' ? 0 : 'auto',
            ...(playerMode === 'video' ? {} : { height: undefined }),
        }),
        [JSON.stringify(theme), JSON.stringify(style), playerMode, playerRatio],
    )

    return React.useMemo(
        () => (
            <div
                {...rest}
                ref={wrapperRef}
                className={clsx('rmp-w-auto rmp-m-auto', className)}
                id='rmp-root'
                style={rmpStyle}
            >
                <div id='rmp-wrapper' className={'w-full h-full relative flex'}>
                    <Player>
                        <MediaBackground />
                        <Media />
                        <MediaUIStack />
                        {playerMode === 'video' && <MediaLayerStack />}
                        <MediaControls />
                    </Player>
                </div>
            </div>
        ),
        [rest, JSON.stringify(rmpStyle), className],
    )
}

export default React.forwardRef(MediaPlayer)
