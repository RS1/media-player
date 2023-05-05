/* ┐
   │ File: index.tsx [/src/bits/index.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 16:45:13
   │ Modified: May 5th, 2023 - 13:55:56
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import MediaLayerStack from '@bits/layers'
import Media from '@bits/media'
import Player from '@bits/player'
import MediaUIStack from '@bits/ui'
import MediaBackground from '@bits/ui/background'
import MediaControls from '@bits/ui/controls'

import { usePlayerMode, useMediaTheme, themeToCSSVars } from '@/media'

import '@css/tailwind.css'

type Props = {
    style?: React.CSSProperties
    className?: string
} & Exclude<React.HTMLAttributes<HTMLDivElement>, 'id' | 'style' | 'className'>

function MediaPlayer(props: Props, forwardedRef: React.Ref<HTMLDivElement>) {
    const { style, className, ...rest } = props
    const theme = useMediaTheme()
    const playerMode = usePlayerMode()

    const rmpStyle: React.CSSProperties = React.useMemo(
        () => ({
            ...(themeToCSSVars(theme) as React.CSSProperties),
            ...style,
            ...(playerMode === 'video' ? {} : { height: undefined }),
        }),
        [JSON.stringify(theme), JSON.stringify(style), playerMode],
    )

    return React.useMemo(
        () => (
            <div {...rest} className={className} id='rmp-root' style={rmpStyle}>
                <div id='rmp-wrapper' ref={forwardedRef} className={'w-full h-full relative'}>
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
